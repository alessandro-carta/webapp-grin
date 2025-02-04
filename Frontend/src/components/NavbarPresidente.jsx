import { NavLink } from "react-router-dom";
import Logout from "./auth/Logout";


function NavbarPresidente(){

    // restitusce la barra di navigazione del presidente
    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4">
            <div className="container mx-auto flex justify-between items-center space-x-6">
                <div className="space-x-6">
                    <NavLink to={`/dashboard`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Corsi Di Studio </NavLink>
                    <NavLink to={`/404`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Richieste </NavLink>
                    <NavLink to={`/404`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Regolamento </NavLink>
                    <NavLink to={`/404`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Bollini </NavLink>
                </div>
                <Logout />
            </div>
        </div>
    )

}

export default NavbarPresidente;