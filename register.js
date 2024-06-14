const { Client } = require('pg');
const express = require('express');
const app = express();

app.use(express.json());

// Kết nối đến PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// Endpoint đăng ký người dùng mới
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  client.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password], (err, result) => {
    if (err) {
      res.status(500).send('Error registering new user');
    } else {
      res.status(200).send('User registered');
    }
  });
});

// Export app để Render có thể sử dụng
module.exports = app;
