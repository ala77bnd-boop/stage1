import * as React from "react";
import { useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";

export default function Historique() {
  const [commandes, setCommandes] = React.useState<any[]>([]);

  // ⚡ useRef avec HTMLDivElement
  const componentRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetch("http://localhost:3000/get-commande")
      .then((res) => res.json())
      .then((data) => setCommandes(data));
  }, []);

  // ⚡ Fonction pour imprimer
  const handlePrint = useReactToPrint({
    // TypeScript veut que ce soit HTMLElement | null
    contentRef: componentRef,
  });

  return (
    <Box p={4} sx={{ml:50}}>
      

      {/* Bouton pour imprimer */}
      

      {/* Zone qu’on veut imprimer */}
      <div ref={componentRef}  className=" w-full border-separate"
              style={{ borderSpacing: "10px" }} >
        <Typography variant="h4" mb={4}>
        Historique des commandes
      </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commandes.map((c) => (
                <TableRow key={c.commande_id}>
                  <TableCell>{c.nom_client}</TableCell>
                  <TableCell>{c.prix_total} €</TableCell>
                  <TableCell>{c.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ mt: 2 }}
      >
        🖨️ Imprimer l’historique
      </Button>
    </Box>
  );
}
