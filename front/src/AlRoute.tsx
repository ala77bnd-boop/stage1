import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveDrawer from "./Components/Drawer";
import Client from "./pages/Client";

export default function AlRoute() {
    return (
        <>
            <BrowserRouter>
            <ResponsiveDrawer/> 
                <Routes>
                    <Route path="/" element={<h1>welcomphdezaqxcvbne</h1>} />
                    <Route path="/client" element={<Client/>} />

                </Routes>
            </BrowserRouter></>
    )
}
