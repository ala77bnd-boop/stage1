import * as React from "react";
import {
    Box,
    Button,
    FormControl,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    InputLabel,
    Divider,
    Modal,
    Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import image from "./produit.jpg";

/* =======================
   TYPES
======================= */
interface PanierItem {
    nom: string;
    prix: number;
    quantite: number;
}

/* =======================
   COMPONENT
======================= */
export default function Commande() {

    /* ---------- STATES ---------- */
    const [nomClient, setNomClient] = React.useState("");
    const [panier, setPanier] = React.useState<PanierItem[]>([]);
    const [produits, setProduits] = React.useState<any[]>([]);
    const [clients, setClients] = React.useState<any[]>([]);

    /* ---------- MODAL STATES ---------- */
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedProduit, setSelectedProduit] = React.useState<any>(null);
    const [quantite, setQuantite] = React.useState(1);

    /* ---------- TOTAL ---------- */
    const total = panier.reduce(
        (acc, item) => acc + item.prix * item.quantite,
        0
    );

    /* ---------- LOAD CLIENTS & PRODUITS ---------- */
    React.useEffect(() => {
        fetch("http://localhost:3000/get-client")
            .then(res => res.json())
            .then(data => setClients(data));

        fetch("http://localhost:3000/get-produit")
            .then(res => res.json())
            .then(data => setProduits(data));
    }, []);

    /* ---------- OPEN MODAL ---------- */
    const openAddModal = (produit: any) => {
        setSelectedProduit(produit);
        setQuantite(1);
        setOpenModal(true);
    };

    /* ---------- ADD TO PANIER ---------- */
    const confirmAddToPanier = () => {
        if (!selectedProduit) return;

        setPanier(prev => {
            const existing = prev.find(
                p => p.nom === selectedProduit.nom
            );

            if (existing) {
                return prev.map(p =>
                    p.nom === selectedProduit.nom
                        ? { ...p, quantite: p.quantite + quantite }
                        : p
                );
            }

            return [
                ...prev,
                {
                    nom: selectedProduit.nom,
                    prix: selectedProduit.prix,
                    quantite,
                },
            ];
        });

        setOpenModal(false);
    };

    /* ---------- REMOVE ---------- */
    const removeFromPanier = (nom: string) => {
        setPanier(prev => prev.filter(p => p.nom !== nom));
    };

    /* =======================
       POST COMMANDE
    ======================= */
    const PostNewCommande = () => {
        if (nomClient.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Il faut sélectionner un client",
            });
        }
        else if (total === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Il faut passer au moins une commande",
            });
        }
        else {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prix: total,
                    nom: nomClient,
                    admine_id: localStorage.getItem("admine_id")
                })
            };

            fetch("http://localhost:3000/post-commande", requestOptions)
                .then(response => response.json())
                .then(data => {
                    Swal.fire(
                        "New Commande a été ajoutée",
                        "",
                        "success"
                    );
                    setPanier([]);
                });
        }
    };

    /* =======================
       RENDER
    ======================= */
    return (
        <Box display="flex" gap={4} p={4} alignItems="flex-start">

            {/* ================= PRODUITS ================= */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap={3}
            >
                {/* SELECT CLIENT */}
                <Box gridColumn="1 / -1">
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Nom client</InputLabel>
                        <Select
                            value={nomClient}
                            label="Nom client"
                            onChange={(e) => setNomClient(e.target.value)}
                        >
                            {clients.map((c: any) => (
                                <MenuItem
                                    key={c.client_id}
                                    value={c.nom_prenom}
                                >
                                    {c.nom_prenom}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* LISTE PRODUITS */}
                {produits.map((p) => (
                    <Paper key={p.produit_id} sx={{ p: 2 }}>
                        <img
                            src={image}
                            alt={p.nom}
                            style={{ width: "100%", borderRadius: 8 }}
                        />
                        <p><strong>{p.nom}</strong></p>
                        <p>{p.prix} €</p>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => openAddModal(p)}
                        >
                            ADD
                        </Button>
                    </Paper>
                ))}
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* ================= PANIER ================= */}
            <Box width={400}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Prix</TableCell>
                                <TableCell>Qté</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {panier.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.nom}</TableCell>
                                    <TableCell>{item.prix} €</TableCell>
                                    <TableCell>{item.quantite}</TableCell>
                                    <TableCell>
                                        {item.prix * item.quantite} €
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            color="error"
                                            onClick={() =>
                                                removeFromPanier(item.nom)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box mt={2}>
                    <strong>Total : {total} €</strong>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={PostNewCommande}
                >
                    Commander
                </Button>
            </Box>

            {/* ================= MODAL ================= */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: "background.paper",
                        p: 3,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6">
                        {selectedProduit?.nom}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        Prix : {selectedProduit?.prix} €
                    </Typography>

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                        mt={2}
                    >
                        <Button
                            variant="outlined"
                            onClick={() =>
                                setQuantite(q => Math.max(1, q - 1))
                            }
                        >
                            −
                        </Button>

                        <Typography>{quantite}</Typography>

                        <Button
                            variant="outlined"
                            onClick={() =>
                                setQuantite(q => q + 1)
                            }
                        >
                            +
                        </Button>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={confirmAddToPanier}
                    >
                        Ajouter au panier
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
