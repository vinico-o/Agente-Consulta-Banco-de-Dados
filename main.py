from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg

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