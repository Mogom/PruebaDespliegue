import { Children } from "react";
import { Navigate, Outlet, redirect} from "react-router";

export const Protegidas=({userIn,children,redirectTo = "/"})=>{
    if (!userIn) {
        return <Navigate to={redirectTo} />;
      }
    return children? children:<Outlet/>
}

