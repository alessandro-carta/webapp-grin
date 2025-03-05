import { NavLink } from "react-router-dom";
import { useState } from "react";


function NavbarPublic(){
const [menuMobile, setMenuMobile] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false); // Stato per gestire il menu a tendina
const hambuger = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>;
let mobile;
if(menuMobile){
    mobile = 
        <div className="md:hidden absolute left-0 top-10 w-full bg-white p-8 space-y-4 flex flex-col">
            <NavLink to={`/`}  className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Homepage</NavLink>
            <div className="relative">
                <button
                    className="link__noactive"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    Login {dropdownOpen ? "-" : "+"}
                </button>
                {dropdownOpen && (
                <div className="absolute left-0 bg-white p-4 w-full flex flex-col">
                    <NavLink to={`/login`} className={({ isActive }) =>isActive ? "link p-1" : "link__noactive p-1"}>Presidente</NavLink>
                    <NavLink to={`/admin-login`} className={({ isActive }) =>isActive ? "link p-1" : "link__noactive p-1"}>Amministratore</NavLink>
                </div>
                )}
            </div>
        </div>;
}
// restitusce la barra di navigazione pubblica
return (
    <div className="fixed top-0 left-0 w-full bg-white md:shadow-sm z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="hidden md:flex space-x-6">
                <NavLink to={`/`}  className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Homepage</NavLink>
                <div className="relative">
                    <button
                        className="link__noactive"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        Login {dropdownOpen ? "-" : "+"}
                    </button>
                    {dropdownOpen && (
                    <div className="absolute left-0 bg-white p-4 w-full flex flex-col">
                        <NavLink to={`/login`} className={({ isActive }) =>isActive ? "link p-1" : "link__noactive p-1"}>Presidente</NavLink>
                        <NavLink to={`/admin-login`} className={({ isActive }) =>isActive ? "link p-1" : "link__noactive p-1"}>Amministratore</NavLink>
                    </div>
                    )}
                </div>
            </div>
            <div className="md:hidden flex items-center">
                <button onClick={() => setMenuMobile(!menuMobile)} className="menu__hamburger">
                    {hambuger}
                </button>
            </div>
            {mobile}
        </div>
    </div>
    )

}

export default NavbarPublic;