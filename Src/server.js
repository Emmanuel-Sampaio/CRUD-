const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Banco de dados SQLite
const db = new sqlite3.Database('./novo_banco.db');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve index.html e style.css

// Cria a tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS pessoas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INT NOT NULL
    )
`);

// [CREATE] Inserir pessoa
app.post('/pessoas', (req, res) => {
    const { nome, idade } = req.body;
    db.run('INSERT INTO pessoas (nome, idade) VALUES (?, ?)', [nome, idade], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send({ id: this.lastID });
    });
});

// [READ] Listar todas as pessoas
app.get('/pessoas', (req, res) => {
    db.all('SELECT * FROM pessoas', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// [UPDATE] Atualizar pessoa por ID
app.put('/pessoas/:id', (req, res) => {
    const { nome, idade } = req.body;
    db.run('UPDATE pessoas SET nome = ?, idade = ? WHERE id = ?', [nome, idade, req.params.id], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send({ changes: this.changes });
    });
});

// [DELETE] Deletar pessoa por ID
app.delete('/pessoas/:id', (req, res) => {
    db.run('DELETE FROM pessoas WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send({ changes: this.changes });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
