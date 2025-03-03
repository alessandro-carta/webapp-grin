import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupAlert from '../PopupAlert';

function Logout(){
    const [showLogoupPopup, setShowLogoutPopup] = useState(false); // per gestire la visualizzazione del popup logout
    const navigate = useNavigate();

    const logoutAccount = () => {
        setShowLogoutPopup(false);
        localStorage.removeItem('token');
        navigate('/');
    }
    // componente per gestire il popup logout
    let component = null;
    if(showLogoupPopup) component = <PopupAlert message="Sei sicuro di effettuare disconnesione dal tuo account?" handleYes={logoutAccount} handleNo={() => {setShowLogoutPopup(false)}} />
    return (
        <>
        <p className="error__message text-base" onClick={() => {setShowLogoutPopup(true)}}>Logout</p>
        {component}
        </>
    )
}

export default Logout;