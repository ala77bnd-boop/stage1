import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveDrawer from "./Components/Drawer";
import Client from "./pages/Client";

export default function AlRoute() {
    return (
        <>
            <BrowserRouter>
                <ResponsiveDrawer />
                <div style={{ marginLeft: 240 }}>
                    <Routes>
                        <Route path="/" element={<h1>Bienvenue {localStorage.getItem("NomAdmine")}</h1>} />
                        <Route path="/client" element={<Client />} />

                    </Routes>
                </div>
            </BrowserRouter></>
    )
}
