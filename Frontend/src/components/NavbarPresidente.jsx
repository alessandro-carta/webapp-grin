import { NavLink } from "react-router-dom";
import Logout from "./auth/Logout";
import { useState, useEffect } from "react";


function NavbarPresidente(){

    const [email, setEmail] = useState();
    const loadEmail = async () => {
        try {
            const response = await fetch(`/api/getEmail`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                const data = await response.json();
                setEmail(data.data.email);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadEmail, []);

    // restitusce la barra di navigazione del presidente
    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4">
            <div className="container mx-auto flex justify-between items-center space-x-6">
                <div className="space-x-6">
                    <NavLink to={`/dashboard/corsidistudio`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Corsi Di Studio </NavLink>
                    <NavLink to={`/dashboard/richieste`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Richieste </NavLink>
                    <NavLink to={`/aree/?Visual=presidente`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Aree e sottoaree </NavLink>
                    <NavLink to={`/regolamento/?Visual=presidente`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Regolamento </NavLink>
                    <NavLink to={`/dashboard/bollini`} className={({isActive}) => isActive ? 'text-blue-800 hover:text-blue-800' : 'text-black hover:text-gray-300'}> Bollini </NavLink>
                </div>
                <div className="space-x-6 flex">
                    <p>{email}</p>
                    <Logout />
                </div>
               
            </div>
        </div>
    )

}

export default NavbarPresidente;