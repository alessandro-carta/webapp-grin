import { Link } from "react-router-dom";


function NavbarGrin(){

    // restitusce la barra di navigazione dell'amministrazione
    return (
        <div className="container mx-auto flex flex-col justify-between items-center space-x-6">
            <div className="space-x-6">
                <Link to={`/`} className="text-blue-800 hover:text-gray-300"> Homepage </Link>
                <Link to={`/presidenti`} className="text-blue-800 hover:text-gray-300"> Account presidenti </Link>
                <Link to={`/aree`} className="text-blue-800 hover:text-gray-300"> Aree e sottoaree </Link>
                <Link to={`/regolamento`} className="text-blue-800 hover:text-gray-300"> Regolamento </Link>
                <Link to={`/richieste`} className="text-blue-800 hover:text-gray-300"> Richieste </Link>

            </div>
        </div>
    )

}

export default NavbarGrin;