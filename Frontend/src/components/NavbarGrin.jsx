import { NavLink } from "react-router-dom";
import Logout from "./auth/Logout";
import { useState } from "react";


function NavbarGrin(){
const [menuMobile, setMenuMobile] = useState(false);
const hambuger = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>;
let mobile;
if(menuMobile){
    mobile = 
        <div className="md:hidden absolute left-0 top-10 w-full bg-white p-8 space-y-4 flex flex-col">
            <NavLink to={`/presidenti`}  className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Account presidenti</NavLink>
            <NavLink to={`/aree/?Visual=admin`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Aree e sottoaree</NavLink>
            <NavLink to={`/regolamento/?Visual=admin`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Regole</NavLink>
            <NavLink to={`/richieste`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Richieste</NavLink>
            <NavLink to={`/bollini`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}>Bollini</NavLink>
        </div>;
}
// restitusce la barra di navigazione dell'admin
return (
    <div className="fixed top-0 left-0 w-full bg-white md:shadow-sm z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="hidden md:flex space-x-6">
                <NavLink to={`/presidenti`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}> Account presidenti </NavLink>
                <NavLink to={`/aree/?Visual=admin`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}> Aree e sottoaree </NavLink>
                <NavLink to={`/regolamento/?Visual=admin`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}> Regole </NavLink>
                <NavLink to={`/richieste`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}> Richieste </NavLink>
                <NavLink to={`/bollini`} className={({isActive}) => isActive ? 'link' : 'link__noactive'}> Bollini </NavLink>
            </div>
            <div className="md:hidden flex items-center">
                <button onClick={() => setMenuMobile(!menuMobile)} className="menu__hamburger">
                    {hambuger}
                </button>
            </div>
            {mobile}
            <div> <Logout /> </div>
        </div>
    </div>
    )

}

export default NavbarGrin;