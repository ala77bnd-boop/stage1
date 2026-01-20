import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveDrawer from "./Components/Drawer";
import Client from "./pages/Client";
import Produit from "./pages/Porduit";

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

                    </Routes>
                </div>
            </BrowserRouter></>
    )
}
