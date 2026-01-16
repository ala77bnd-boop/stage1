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
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch(err => console.error('Erreur connexion DB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// ================== ADMIN ==================

// GET tous les admins
app.get('/get-admin', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM admin');
        res.json(data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST login admin
app.post('/login-admin', async (req, res) => {
    try {
        const { email, mdp } = req.body;

        const sql = `
            SELECT * FROM admin
            WHERE email = $1 AND mdp = $2
        `;
        const data = await client.query(sql, [email, mdp]);

        if (!data.rows[0]) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        res.json(data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================== CLIENT ==================

// GET tous les clients
app.get('/get-client', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM client');
        res.json(data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST créer un client
app.post('/post-client', async (req, res) => {
    try {
        const { nom_prenom, adresse, admine_id } = req.body;

        const sql = `
            INSERT INTO client (nom_prenom, adresse, admine_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const data = await client.query(sql, [nom_prenom, adresse, admine_id]);
        res.status(201).json(data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT modifier un client
app.put('/put-client/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_prenom, adresse, admine_id } = req.body;

        const sql = `
            UPDATE client
            SET nom_prenom = $1, adresse = $2, admine_id = $3
            WHERE id = $4
            RETURNING *
        `;
        const data = await client.query(sql, [nom_prenom, adresse, admine_id]);

        if (!data.rows[0]) {
            return res.status(404).json({ error: 'Client introuvable' });
        }

        res.json(data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE supprimer un client
app.delete('/delete-client/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            DELETE FROM client
            WHERE client_id = $1
            RETURNING *
        `;
        const data = await client.query(sql, [id]);

        if (!data.rows[0]) {
            return res.status(404).json({ error: 'Client introuvable' });
        }

        res.json(data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================== SERVER ==================
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
