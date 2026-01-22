import * as React from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import Swal from "sweetalert2";

interface Produit {
    produit_id: number;
    nom: string;
    prix: number;
}
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};
const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function Produit() {
    const [produits, setProduits] = React.useState<Produit[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [adresse, setAdresse] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [currentProduit, setCurrentProduit] = React.useState<Produit | null>(null);
    const [nom, setNom] = React.useState("");
    const [prix, setPrix] = React.useState<number>(0);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    // FETCH PRODUITS
    React.useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch(`http://localhost:3000/get-produit/${localStorage.getItem("admine_id")}`);
                if (!response.ok) throw new Error(`Erreur: ${response.status}`);
                const data = await response.json();
                setProduits(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduits();
    }, [refresh]);

    const handleOpenModal = (produit?: Produit) => {
        if (produit) {
            setCurrentProduit(produit);
            setNom(produit.nom);
            setPrix(produit.prix);
        } else {
            setNom("");
            setPrix(0);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleSaveProduit = () => {
        if (!nom || prix <= 0) {
            Swal.fire("Erreur", "Nom et prix valides requis", "error");
            return;
        }
        else {
            fetch("http://localhost:3000/post-produit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom: nom,
                    image: "",
                    prix: prix.toString(),
                    admine_id: localStorage.getItem("admine_id"),
                }),
            })
                .then(res => res.json())
                .then((newProduit) => {
                    setProduits(prev => [...prev, newProduit]);
                    Swal.fire("Produit ajouté", "", "success");
                });
        }

        handleCloseModal();
    };

    const handleDeleteProduit = (id: number) => {
        console.log({ id })
        setProduits(prev => prev.filter(p => p.produit_id !== id));

        fetch(`http://localhost:3000/delete-produit/${id}`, {
            method: "DELETE",
        });

        Swal.fire("Supprimé", "Le produit a été supprimé", "success");
    }


    const updateClient = () => {
      console.log(currentProduit)
        fetch(`http://localhost:3000/update-produit/${currentProduit!.produit_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom: nom,
                prix: prix,
            }),
        })
            .then(() => {
                setRefresh(prev => !prev);
                Swal.fire("Client modifié", "", "success");
                setOpenEdit(false);
            });
    };

    const openEditModal = (client: Produit) => {
        setCurrentProduit(client);
        (client);
        setNom(client.nom);
        setPrix(client.prix);
        setOpenEdit(true);
    };
    return (
        <Box p={8}>
            {/* CONTENEUR CENTRÉ */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal()}
                    >
                        Ajouter un produit
                    </Button>
                </Box>


                {/* WRAPPER DE CENTRAGE RÉEL */}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <TableContainer
                        component={Paper}
                        sx={{
                            width: 900,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Prix</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {produits.map((produit) => (
                                    <TableRow key={produit.produit_id}>
                                        <TableCell>{produit.nom}</TableCell>
                                        <TableCell>{produit.prix} €</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                size="small"
                                                onClick={() => openEditModal(produit)}
                                                sx={{ mr: 1 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteProduit(produit.produit_id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* MODAL */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <h2>Ajouter Produit</h2>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Nom et prénom</FormLabel>
                        <TextField
                            fullWidth
                            label="Nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            margin="normal"
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel>Adresse</FormLabel>
                        <TextField
                            fullWidth
                            label="Prix"
                            type="number"
                            value={prix}
                            onChange={(e) => setPrix(Number(e.target.value))}
                            margin="normal"
                        />
                    </FormControl>

                    <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={handleSaveProduit}>
                        Ajouter
                    </Button>
                </Box>
            </Modal>
            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box sx={style}>
                    <h2>Modifier produit</h2>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Nom et prénom</FormLabel>
                        <TextField
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel>prix</FormLabel>
                        <TextField
                            value={prix}
                            onChange={e => setPrix(Number(e.target.value))}
                        />
                    </FormControl>

                    <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={updateClient}>
                        Modifier
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}