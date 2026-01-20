const express = require('express');
const pg = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// PostgreSQL
const { Client } = pg;
const connectionString = 'postgresql://postgres:1234@localhost:5432/stage1';

const client = new Client({ connectionString });

client
    .connect()
    .then(() => console.log('Connexion DB OK'))
    .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
/// admine 

app.get('/get-admin', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM admin');
        res.json(data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST login admin
app.post('/login-admine', async (req, res) => {
    try {
        const { email, mdp } = req.body;

        const sql = `
            SELECT * FROM admin
            WHERE email = $1 AND mdp = $2
        `;
        const data = await client.query(sql, [email, mdp]);

        res.json(data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= CLIENT ================= */

// GET clients ✅
app.get('/get-client', async (req, res) => {
    const data = await client.query(`
        SELECT 
            client_id AS id,
            nom_prenom,
            adresse,
            admine_id
        FROM client
    `);
    res.json(data.rows);
});

// POST client ✅
app.post('/post-client', async (req, res) => {
    const { nom_prenom, adresse, admine_id } = req.body;

    const data = await client.query(`
        INSERT INTO client (nom_prenom, adresse, admine_id)
        VALUES ($1, $2, $3)
        RETURNING 
            client_id AS id,
            nom_prenom,
            adresse,
            admine_id
    `, [nom_prenom, adresse, admine_id]);

    res.status(201).json(data.rows[0]);
});

// PUT client ✅
app.put('/update-client/:id', async (req, res) => {
    const { id } = req.params;
    const { nom_prenom, adresse } = req.body;

    const data = await client.query(`
        UPDATE client
        SET nom_prenom = $1, adresse = $2
        WHERE client_id = $3
        RETURNING 
            client_id AS id,
            nom_prenom,
            adresse,
            admine_id
    `, [nom_prenom, adresse, id]);

    if (!data.rows[0]) {
        return res.status(404).json({ error: 'Client introuvable' });
    }

    res.json(data.rows[0]);
});

// DELETE client ✅✅✅
app.delete('/delete-client/:id', async (req, res) => {
    const { id } = req.params;

    await client.query(`
        DELETE FROM client
        WHERE client_id = $1
    `, [id]);

    res.json({ success: true });
});





/* ================== PRODUIT ================== */

// GET tous les produits
app.get('/get-produit', async (req, res) => {
    try {
        const data = await client.query(`
            SELECT *
            FROM produit
        `);
        res.json(data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST créer un produit
app.post('/post-produit', async (req, res) => {
    try {
        const { nom, image, prix, admine_id } = req.body;

        const data = await client.query(`
            INSERT INTO produit (nom, image, prix, admine_id)
            VALUES ($1, $2, $3, $4)
            RETURNING 
                produit_id AS id,
                nom,
                image,
                prix,
                admine_id
        `, [nom, image, prix, admine_id]);

        res.status(201).json(data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT modifier un produit
app.put('/update-produit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, image, prix } = req.body;

        const data = await client.query(`
            UPDATE produit
            SET nom = $1, image = $2, prix = $3
            WHERE produit_id = $4
            RETURNING *
        `, [nom, image, prix, id]);

        res.json(data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE un produit
app.delete('/delete-produit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const data = await client.query(`
            DELETE FROM produit
            WHERE produit_id = $1
        `, [id]);

        if (!data.rows[0]) {
            return res.status(404).json({ error: 'Produit introuvable' });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});