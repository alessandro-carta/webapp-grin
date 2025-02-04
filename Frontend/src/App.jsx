import './App.css';
import { Link } from 'react-router-dom';
import FormLoginPresidente from './components/auth/FormLoginPresidente';
import { useState, useEffect } from "react";

function App() {

  const [pageTitle, setPageTitle] = useState('Accesso Area Riservata');
  useEffect(() => { document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle
  

  return (
    <>
      <div className='flex flex-col items-center gap-4 justify-center'>
        <p className="text-blue-800 text-4xl">{pageTitle}</p>
        <FormLoginPresidente />
        <Link className="text-blue-500 hover:text-blue-700" to={'/admin-login'}>
          Accedi come admin
        </Link>
      </div>
      
    </>
  )
}

export default App
