import { useState } from "react";
import CreationCompte from "./Conexions/CreationCompte";
import Login from "./Conexions/Login";

export default function App() {
  const [signUp, setSignUp] = useState(true)
  return (
    <>
      {
        signUp ? <CreationCompte {...{signUp,setSignUp}} /> : <Login />
      }

      {/* <Login/> */}

    </>
  )
}
