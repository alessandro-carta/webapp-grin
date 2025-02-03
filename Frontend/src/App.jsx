import './App.css'
import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <h1 className='text-blue-800'>Homepage</h1>
      <Link className="text-blue-500 hover:text-blue-700" to={'/admin-login'}>
        Accedi come admin
      </Link>
    </>
  )
}

export default App
