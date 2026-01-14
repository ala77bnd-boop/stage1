CREATE TABLE admin (
    id serial  PRIMARY KEY, // serail : auto incrumentation
    nom VARCHAR(250),
    email VARCHAR(250),
    mdp VARCHAR(250) 
);
// db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "password",
  database: "ma_base",
  port: 5432
});

module.exports = pool;

