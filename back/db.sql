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
    admine_id INT REFERENCES admine(admine_id)
);
