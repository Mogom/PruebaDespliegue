import { Children } from "react";
import { Navigate, Outlet, redirect} from "react-router";

export const ProtegidasRol=({userIn,children,redirectTo = "/"})=>{
    if (!userIn || !userIn.rol || !userIn.rol.includes("Admin")){
        return <Navigate to={redirectTo}/>
    }
    return children? children:<Outlet/>
}