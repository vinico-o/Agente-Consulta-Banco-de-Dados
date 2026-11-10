from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg

import urllib.request
import json

#rodar o back
#uvicorn main:app --reload --port 8000

app = FastAPI()

#permite que o React se comunique com o FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#armazena is dados da conexao ativa
db_config = {}

#cria a classe com os dados da conexao, vindos da ConnectionModal
class DadosConexao(BaseModel):
    host: str
    port: str
    database: str
    user: str
    password: str

@app.post("/api/connect")
def conectar(dados: DadosConexao):
    try:
        # Conecta ao PostgreSQL usando psycopg puro
        conn = psycopg.connect(
            host=dados.host,
            port=int(dados.port),
            dbname=dados.database,
            user=dados.user,
            password=dados.password
        )
        
        with conn.cursor() as cur:
            #busca os metadados (nomes das tabelas do esquema public)
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            # registra as tabelas em uma lista
            tables = []
            for row in cur.fetchall():
                tables.append(row[0])
            
        conn.close()

        # salva configuração para usar nas próximas consultas
        global db_config
        db_config = dados.model_dump()

        # faz a pergunta de forma automatica
        gerar_sql(DadosPergunta(pergunta="Quais são os 5 primeiros filmes cadastrados?"))
        
        return {
            "success": True,
            "message": "Conectado com sucesso!",
            "tables": tables
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Erro ao conectar: {str(e)}"
        }

# conexao com ollama para o modelo de llm
class DadosPergunta(BaseModel):
    pergunta: str = "Liste os 10 primeiros clientes" # por enquanto a pergunta é fixa

@app.post("/api/gerar-sql")
def gerar_sql(dados: DadosPergunta):

    #verifica se existem informacoes do banco de dados
    if not db_config:
        return {"success": False, "message": "Conecte a um banco pelo site primeiro!"}

    try:
        # faz a conexao com o site por meio dos dados
        conn = psycopg.connect(
            host=db_config["host"],
            port=int(db_config["port"]),
            dbname=db_config["database"],
            user=db_config["user"],
            password=db_config["password"]
        )

        #cria o cursor
        with conn.cursor() as cur: #garante que o cursor será fechado automaticamente
            cur.execute("""
                SELECT table_name, column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public'
                ORDER BY table_name, ordinal_position;
            """)
            #salva o resultado da consulta em forma de tupla
            colunas = cur.fetchall()
        conn.close()

        # define a estrutura do banco em texto
        esquema_texto = ""
        for tabela, coluna, tipo in colunas:
            esquema_texto += f"- Tabela {tabela}: coluna {coluna} ({tipo})\n"

        #define o prompt
        prompt = f"""Você é um especialista em PostgreSQL.

            Esquema do banco (schema public):
            {esquema_texto}

            Regras:
            - Gere SOMENTE uma consulta SELECT. Nunca use INSERT, UPDATE, DELETE, DROP, ALTER ou similares.
            - Use apenas tabelas e colunas listadas acima.
            - Adicione LIMIT 100 se a pergunta não pedir um limite.
            - Responda apenas com o SQL, sem explicações e sem markdown.
            - Se a pergunta não puder ser respondida com esse esquema, responda exatamente: IMPOSSIVEL

            Pergunta: {dados.pergunta}
            """

        # chama o Ollama local na porta 11434
        #utiliza o qwen2.5-coder:7b
        req = urllib.request.Request(
            "http://localhost:11434/api/generate", #cria um objeto de requisição HTTP
            data=json.dumps({ #converte um dicionário em uma string com o mesmo formato de um json.
                "model": "qwen2.5-coder:1.5b",
                "prompt": prompt,
                "stream": False #manda tudo de uma vez, nao por partes
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        with urllib.request.urlopen(req) as response: #envia a requisicao e abre a resposta
            res_ollama = json.loads(response.read().decode("utf-8"))
            sql_gerado = res_ollama["response"].strip()
        print("SQL GERADO PELO OLLAMA:\n", sql_gerado) #mostra no terminal para ops testes

        with psycopg.connect(
            host=db_config["host"],
            port=int(db_config["port"]),
            dbname=db_config["database"],
            user=db_config["user"],
            password=db_config["password"]
        ) as conn_exec:
            with conn_exec.cursor() as cur:
                cur.execute(sql_gerado)
                resultado = cur.fetchall()
                print("RESULTADO DO BANCO:\n", resultado)
        
        return {
            "success": True,
            "sql": sql_gerado
        }

    except Exception as e:
        return {"success": False, "message": f"Erro: {str(e)}"}