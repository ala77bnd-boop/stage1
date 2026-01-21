CREATE TABLE admin (
    id serial  PRIMARY KEY, // serail : auto incrumentation
    nom VARCHAR(250),
    email VARCHAR(250),
    mdp VARCHAR(250) 
);


CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,
    nom_prenom VARCHAR(255),
    adresse VARCHAR(255),
    admine_id Serial REFERENCES admin(id)
);

CREATE TABLE produit (
    produit_id SERIAL PRIMARY KEY,
    nom VARCHAR(250),
    image VARCHAR(250),
    prix VARCHAR(250),
    admine_id INT REFERENCES admin(id)
);

CREATE TABLE Commande (
    commande_id SERIAL PRIMARY KEY,
    prix_total VARCHAR(250),
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    nom_client VARCHAR(250),
    admine_id INTEGER REFERENCES admin(id)
);
