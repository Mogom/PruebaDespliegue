import { Link } from "react-router";
import React from "react";

export default function NavBar(){
    return(
        <nav>
            <ul>
                <li><Link to="/" className="Active">Home</Link></li>
                <li><Link to="/archivo">Archivo</Link></li>
                <li><Link to="/edicion">Edicion</Link></li>
                <li><Link to="/formato">Formato</Link></li>
                <li><Link to="/ver">Ver</Link></li>
                <li><Link to="/ayuda">Ayuda</Link></li>
            </ul>
        </nav>
    );
}