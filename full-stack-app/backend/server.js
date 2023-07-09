const express = require('express');
const { Sequelize } = require('sequelize');
const { ConnectionError } = require('sequelize');
const tedious = require('tedious');
const mssql = require('mssql');

const app = express();
const PORT = 3000;

const sequelize = new Sequelize({
  dialect: 'mssql',
  dialectModule: mssql,
  dialectOptions: {
    options: {
      encrypt: true, // If you need to enable encryption
      trustServerCertificate: true, // If using a self-signed certificate
    },
  },
  host: 'localhost',
  port: 1433, // Default port for MS SQL Server
  database: 'tempdb',
  username: 'SA', // Replace with your MS SQL username
  password: 'Kishore200#', // Replace with your MS SQL password
});

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Create the table if it doesn't exist
User.sync()
  .then(() => {
    console.log('User table created successfully.');
  })
  .catch((err) => {
    console.error('Error creating User table:', err);
  });

app.use(express.json());

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;

  User.create({ username, password })
    .then(() => {
      res.json({ message: 'User registered successfully!' });
    })
    .catch((err) => {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { username, password } })
    .then((user) => {
      if (user) {
        res.json({ message: 'Login successful!', username });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch((err) => {
      console.error('Error validating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
