import { useNavigate } from 'react-router-dom';

function Logout(){
    const navigate = useNavigate();

    const logoutAccount = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    
    return (
        <p className="error__message text-base" onClick={logoutAccount}>Logout</p>
    )
}

export default Logout;