const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

//guarda a conexao ativa
let dbConnection = null;

app.post('/api/connect', async (req, res) => {
  const { host, port, database, user, password } = req.body;
  try {
    // fecha a conexao existente se ja existir uma
    if(dbConnection != null) {
      await dbConnection.end();
    }

    // cria o conexao com osvalores vindos do formulario
    dbConnection = await mysql.createConnection({
      host,
      port: Number(port),
      database,
      user,
      password,
    });
    
    // resgata o nome das tabelas do banco no MySQL
    const [rows] = await dbConnection.query('SHOW TABLES');
    const tables = rows.map(row => Object.values(row)[0]);

    res.json({ 
      success: true, 
      message: 'Conectado com sucesso!',
      tables 
    });

  } catch (e) {
    res.status(400).json({ 
      success: false, 
      message: 'Erro ao conectar: ' + e.message 
    });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend rodando em http://localhost:3306');
});