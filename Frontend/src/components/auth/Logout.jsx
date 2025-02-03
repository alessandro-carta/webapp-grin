import { useNavigate } from 'react-router-dom';

function Logout(){
    const navigate = useNavigate();

    const logoutAccount = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    
    return (
        <p className="text-red-700 text-base" onClick={logoutAccount}>Logout</p>
    )
}

export default Logout;