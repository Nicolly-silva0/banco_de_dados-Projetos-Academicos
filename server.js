const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o MySQL
const dbConfig = {
  host: "localhost",
  user: "root",     // substitua pelo seu usuário do MySQL
  password: "ns158465182020-1811",   // substitua pela sua senha
  database: "lista_de_tarefas",
};

let pool;

// Função para conectar no banco e criar pool de conexões
async function conectarBanco() {
  pool = await mysql.createPool(dbConfig);
}

conectarBanco().catch(err => {
  console.error("Erro ao conectar no banco:", err);
});

// Pega todas as tarefas
app.get("/tarefas", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tarefas");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// Atualiza a lista inteira de tarefas no banco
app.post("/tarefas", async (req, res) => {
  const novaLista = req.body;
  console.log("Dados recebidos do frontend:", novaLista);

  if (!Array.isArray(novaLista)) {
    return res.status(400).json({ error: "Esperado um array de tarefas." });
  }

  try {
    // Limpa todas as tarefas antigas
    await pool.query("DELETE FROM tarefas");

    // Insere todas as tarefas novas
    const promises = novaLista.map(tarefa => {
      return pool.query(
        "INSERT INTO tarefas (texto, completa) VALUES (?, ?)",
        [tarefa.texto, tarefa.completa]
      );
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Lista atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
