import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveDrawer from "./Components/Drawer";
import Client from "./pages/Client";
import Produit from "./pages/Porduit";
import Commande from "./pages/Commande";
import Historique from "./pages/Historique";

export default function AlRoute({setIsConeter}:any) {
    return (
        <>
            <BrowserRouter>
                <ResponsiveDrawer {...{setIsConeter}} />
                <div style={{ marginLeft: 240 }}>
                    <Routes>
                        <Route path="/" element={<h1>Bienvenue {localStorage.getItem("NomAdmine")}</h1>} />
                        <Route path="/client" element={<Client />} />
                         <Route path="/produits" element={<Produit />} />
                         <Route path="/commande" element={<Commande />} />
                         <Route path="/History" element={<Historique />} />
                    </Routes>
                </div>
            </BrowserRouter></>
    )
}
