import { useEffect, useState } from "react";
import CreationCompte from "./pages/CreationCompte";
import Login from "./pages/Login";
import { BrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AlRoute from "./AlRoute";

export default function App() {
  const [signUp, setSignUp] = useState(true);
  const [isConeter, setIsConeter] = useState<any>(false);

  useEffect(() => {
   setIsConeter(localStorage.getItem("admine_id"))
  }, [isConeter])
  
  return (
    <>
      {
        !isConeter ? signUp ? (
          <CreationCompte signUp={signUp} setSignUp={setSignUp} />
        ) : (
          <Login {... { setIsConeter }} /> 
        ) :
          <AlRoute {...{setIsConeter}} /> // paasage d'un parametre
      }
    </>
  );
}


