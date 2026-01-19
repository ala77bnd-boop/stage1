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

/* =======================
   TYPE
======================= */
interface Client {
    id: number;
    nom_prenom: string;
    adresse: string;
    admine_id: number;
}

/* =======================
   MODAL STYLE
======================= */
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

/* =======================
   COMPONENT
======================= */
export default function Client() {

    /* ---------- STATES ---------- */
    const [clients, setClients] = React.useState<Client[]>([]);
    const [refresh, setRefresh] = React.useState(false);

    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const [currentClient, setCurrentClient] = React.useState<Client | null>(null);

    const [nomPrenom, setNomPrenom] = React.useState("");
    const [adresse, setAdresse] = React.useState("");

    /* ---------- LOAD CLIENTS ---------- */
    React.useEffect(() => {
        fetch("http://localhost:3000/get-client")
            .then(res => res.json())
            .then(data => setClients(data));
    }, [refresh]);

    /* ---------- ADD CLIENT ---------- */
    const addClient = () => {
        fetch("http://localhost:3000/post-client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom_prenom: nomPrenom,
                adresse: adresse,
                admine_id: 1,
            }),
        })
            .then(() => {
                setRefresh(prev => !prev);
                Swal.fire("Client ajouté", "", "success");
                setOpenAdd(false);
                setNomPrenom("");
                setAdresse("");
            });
    };

    /* ---------- DELETE CLIENT (FIX FINAL) ---------- */
    const deleteClient = (id: number) => {

                // ✅ suppression immédiate en front
                setClients(prev => prev.filter(c => c.id !== id));

                fetch(`http://localhost:3000/delete-client/${id}`, {
                    method: "DELETE",
                })
                    .then(() => {
                        setRefresh(prev => !prev); // resync backend
                        Swal.fire("Supprimé", "Le client a été supprimé", "success");
                    });
        
    };

    /* ---------- OPEN EDIT ---------- */
    const openEditModal = (client: Client) => {
        setCurrentClient(client);
        setNomPrenom(client.nom_prenom);
        setAdresse(client.adresse);
        setOpenEdit(true);
    };

    /* ---------- UPDATE CLIENT ---------- */
    const updateClient = () => {

        fetch(`http://localhost:3000/update-client/${currentClient!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom_prenom: nomPrenom,
                adresse: adresse,
            }),
        })
            .then(() => {
                setRefresh(prev => !prev);
                Swal.fire("Client modifié", "", "success");
                setOpenEdit(false);
            });
    };

    /* =======================
       RENDER
    ======================= */
    return (
        <Box sx={{ p: 3 }}>

            <Button variant="contained" onClick={() => setOpenAdd(true)}>
                Ajouter client
            </Button>

            <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
                <Box sx={style}>
                    <h2>Ajouter client</h2>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Nom et prénom</FormLabel>
                        <TextField
                            value={nomPrenom}
                            onChange={e => setNomPrenom(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel>Adresse</FormLabel>
                        <TextField
                            value={adresse}
                            onChange={e => setAdresse(e.target.value)}
                        />
                    </FormControl>

                    <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={addClient}>
                        Ajouter
                    </Button>
                </Box>
            </Modal>

            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box sx={style}>
                    <h2>Modifier client</h2>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Nom et prénom</FormLabel>
                        <TextField
                            value={nomPrenom}
                            onChange={e => setNomPrenom(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel>Adresse</FormLabel>
                        <TextField
                            value={adresse}
                            onChange={e => setAdresse(e.target.value)}
                        />
                    </FormControl>

                    <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={updateClient}>
                        Modifier
                    </Button>
                </Box>
            </Modal>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom et prénom</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell>Admin ID</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {clients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>{client.nom_prenom}</TableCell>
                                <TableCell>{client.adresse}</TableCell>
                                <TableCell>{client.admine_id}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        sx={{ mr: 1 }}
                                        variant="contained"
                                        onClick={() => openEditModal(client)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="contained"
                                        onClick={() => deleteClient(client.id)}
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
    );
}
