import './App.css';
import { Link } from 'react-router-dom';
import FormLoginPresidente from './components/auth/FormLoginPresidente';
import { useState, useEffect } from "react";
import Loading from './components/Loading';

function App() {

  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Accesso Area Riservata');
  useEffect(() => { 
    setLoading(false);
    document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle
  

  if(loading) return <Loading />
  return (
    <>
      <div className='flex flex-col items-center gap-4 justify-center'>
        <p className="title text-3xl">{pageTitle}</p>
        <FormLoginPresidente />
        <Link className="link" to={'/admin-login'}>
          Accedi come admin
        </Link>
      </div>
      
    </>
  )
}

export default App
