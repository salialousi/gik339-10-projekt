const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


const db = new sqlite3.Database('./resources.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  )`);

 
  const insertSQL = 'INSERT INTO resources (name, description) VALUES (?, ?)';
  db.run(insertSQL, ['Alice', 'Project Manager at TechCorp']);
  db.run(insertSQL, ['Bob', 'Software Engineer at CodeBase']);
  db.run(insertSQL, ['Charlie', 'UI/UX Designer at DesignHub']);
});


app.get('/resources', (req, res) => {
  db.all('SELECT * FROM resources', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM resources WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

app.post('/resources', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const sql = 'INSERT INTO resources (name, description) VALUES (?, ?)';
  db.run(sql, [name, description], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create resource' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.put('/resources/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const sql = 'UPDATE resources SET name = ?, description = ? WHERE id = ?';
  db.run(sql, [name, description, id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update resource' });
    }
    res.json({ updated: this.changes });
  });
});

app.delete('/resources/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM resources WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete resource' });
    }
    res.json({ deleted: this.changes });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
