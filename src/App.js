import {BrowserRouter, Routes, Route, Link} from "react-router"
import './App.css';
import NavBar from "./Components/NavBar";
// import { Home, Formato, Ayuda, Ver, Archivo, Edicion } from "./Pages";
import { Home } from "./Pages/Home";
import { Ayuda } from "./Pages/Ayuda";
import { Edicion } from "./Pages/Edicion";
import { Formato } from "./Pages/Formato";
import { Ver } from "./Pages/Ver";
import { Archivo } from "./Pages/Archivo";
import { useState } from "react";
import { Protegidas } from "./Components/Protected";
import { ProtegidasRol } from "./Components/ProtectedRol";

function App() {

  const [user, setUser] = useState(null)

  const login=(data)=>{
    setUser(data)
  }

  const users=[
    {
      id :1,
      nombre :"Kevin",
      rol:"Admin"
    },
    
    {
    id :2,
    nombre :"Critian",
    rol:"User"
  }
  ]

  const logout =()=>{setUser(null)}
  
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>

        {user? (
          <button onClick={logout}>Logout</button>
        ):(
          <button onClick={() => login(users[0])}>Login</button>
        )}
        {console.log(user)}

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route element={< Protegidas userIn={user}/>} >
            <Route path="archivo" element={<Archivo />} />
            <Route path="edicion" element={<Edicion />} />
          </Route>
          <Route element={<ProtegidasRol userIn={user} />} >
            <Route path="formato" element={<Formato />} />
            <Route path="ver" element={<Ver />} />
            <Route path="ayuda" element={<Ayuda />} />
          </Route>
          
          {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
    </div>
  );
}



export default App;
