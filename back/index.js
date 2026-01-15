const express = require('express')
const pg = require('pg')
const app = express()
const cors = require('cors')

const port = 3000
const { Client } = pg
const connectionString = 'postgresql://postgres:1234@localhost:5432/stage1'

const client = new Client({
    connectionString,
})
client.connect().then(() => console.log("connetion avec db"))
app.use(express.json()); // pour lire le JSON
app.use(cors())
app.get('/get-admine', async (req, res) => {
    const sql = 'select * from admin'
    const data = await client.query(sql)
    res.json(data.rows)
})
// post // get // put // delete
// crud


// POST créer un post
app.post("/post-admine", async (req, res) => {
    const { nom, email, mdp } = req.body;
    console.log(nom)
    const sql = `INSERT INTO admin (nom, email, mdp) VALUES ('${nom}', '${email}', '${mdp}') RETURNING  * `
    const data = await client.query(sql)
    res.json(data.rows)
});
// // put // delete
// login 
app.post("/login-admine", async (req, res) => {
    const { email, mdp } = req.body;
    const sql = `SELECT * FROM admin
WHERE email = '${email}'
  AND mdp = '${mdp}'`
    const data = await client.query(sql)
    res.json(data.rows)
});


app.post("/post-admine", async (req, res) => {
    const { nom, email, mdp } = req.body;
    console.log(nom)
    const sql = `INSERT INTO admin (nom, email, mdp) VALUES ('${nom}', '${email}', '${mdp}') RETURNING  * `
    const data = await client.query(sql)
    res.json(data.rows)
});
// // put // delete
// login 
app.post("/login-admine", async (req, res) => {
    const { email, mdp } = req.body;
    const sql = `SELECT * FROM admin
WHERE email = '${email}'
  AND mdp = '${mdp}'`
    const data = await client.query(sql)
    res.json(data.rows)
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})