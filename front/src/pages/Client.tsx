

import * as React from "react";
import FormControl from '@mui/material/FormControl';

import {
    Box,
    Button,
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
    Typography,
} from "@mui/material";
import Swal from "sweetalert2";

interface Client {
    nom: string;
    email: string;
    adresse: string;
    admine_id: number;
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
export default function Client() {
    const [showTable, setShowTable] = React.useState(false);
    const [clients, setClients] = React.useState<Client[]>([]);

    // 1️⃣ Charger depuis localStorage
    //   const loadClients = () => {
    //     const data = localStorage.getItem("clients");
    //     if (data) {
    //       setClients(JSON.parse(data));
    //     }
    //     setShowTable(true);
    //   };

    // 2️⃣ Initialisation (comme ton exemple myCat)
    React.useEffect(() => {
        fetch('http://localhost:3000/get-client')
            .then(response => response.json())
            .then(data => setClients(data));
    }, []);

    // 3️⃣ Supprimer un client
    //   const deleteClient = (index: number) => {
    //     const updated = clients.filter((_, i) => i !== index);
    //     setClients(updated);
    //     localStorage.setItem("clients", JSON.stringify(updated));
    //   };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [NometPrenom, setNometPrenom] = React.useState('');
    const [adresse, setadresse] = React.useState('');
    const AddFunction = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom_prenom: NometPrenom,
                adresse: adresse,
                admine_id: 1
            })
        };
        fetch('http://localhost:3000/post-client', requestOptions)
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    title: "New Client a ete ajouté avec suces!",
                    icon: "success",
                    draggable: true
                });
                handleClose()
                //   setIsConeter(true)

            });
    }
    return (
        <Box sx={{ p: 3 }}>

            <Box sx={{ display: "flex", justifyContent: "center", mt: -35, ml: 130, backgroundColor: "red", }}>
                <Button variant="contained"
                    onClick={handleOpen}
                >
                    Ajouter client
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={{ ...style, width: 400 }}>
                        <h2 id="parent-modal-title">Ajouter client</h2>
                        <FormControl>
                            <FormLabel htmlFor="email">Nom et prenom</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="nom et prenom"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                onChange={(e) => {
                                    setNometPrenom(e.target.value)
                                }
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">adresse</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="adresse"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                onChange={(e) => {
                                    setadresse(e.target.value)
                                }
                                }
                            />
                        </FormControl>
                        <Button
                            // type="submit"
                            fullWidth
                            variant="contained"
                            onClick={AddFunction}
                            sx={{ mt: 3 }}
                        >
                            Ajouter
                        </Button>
                    </Box>
                </Modal>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 5 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>nom et prenom</TableCell>
                            <TableCell>adresse</TableCell>
                            <TableCell>admine id</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {clients.map((client: any, index) => (
                            <TableRow key={index}>
                                <TableCell>{client.nom_prenom}</TableCell>
                                <TableCell>{client.adresse}</TableCell>
                                <TableCell>{client.admine_id}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    //   onClick={() => deleteClient(index)}
                                    >
                                        Delete
                                    </Button>
                                    <Button variant="contained" size="small">
                                        Edit
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
