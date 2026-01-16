import { useState } from "react";
import CreationCompte from "./pages/CreationCompte";
import Login from "./pages/Login";
import { BrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AlRoute from "./AlRoute";

export default function App() {
  const [signUp, setSignUp] = useState(true);
  const [isConeter, setIsConeter] = useState(false);


  return (
      <>
        {/* {
          !isConeter ? signUp ? (
            <CreationCompte signUp={signUp} setSignUp={setSignUp} />
          ) : (
            <Login {... {setIsConeter}}/>
          ) : */}
            <AlRoute />
        {/* // } */}
      </>
  );
}
