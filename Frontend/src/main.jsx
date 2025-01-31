import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import PresidentiPage from './pages/presidenti/PresidentiPage.jsx'
import PresidentePage from './pages/presidenti/PresidentePage.jsx'
import CreateNewPresidentePage from './pages/presidenti/CreateNewPresidentePage.jsx'
import CreateNewAreaPage from './pages/aree/CreateNewAreaPage.jsx'
import AreePage from './pages/aree/AreePage.jsx'
import UpdateAreaPage from './pages/aree/UpdateAreaPage.jsx'
import CreateNewSottoareaPage from './pages/aree/CreateNewSottoareaPage.jsx'
import SottoareePage from './pages/aree/SottoareePage.jsx'
import UpdateSottoareaPage from './pages/aree/UpdateSottoareaPage.jsx'
import UpdatePresidentePage from './pages/presidenti/UpdatePresidentePage.jsx'
import RegolamentoPage from './pages/regolamento/RegolamentoPage.jsx'
import CreateNewRegolaPage from './pages/regolamento/CreateNewRegolaPage.jsx'
import RichiestePage from './pages/richieste/RichiestePage.jsx'
import RichiestaPage from './pages/richieste/RichiestaPage.jsx'
import ControlloRegolePage from './pages/richieste/ControlloRegolePage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "presidenti",
    element: <PresidentiPage />
  },
  {
    path: "presidenti/:idPresidente",
    element: <PresidentePage />
  },
  {
    path: "crea-un-nuovo-account",
    element: <CreateNewPresidentePage />
  },
  {
    path: "modifica-account/:idPresidente",
    element: <UpdatePresidentePage />
  },
  {
    path: "aree",
    element: <AreePage />
  },
  {
    path: "crea-una-nuova-area",
    element: <CreateNewAreaPage />
  },
  {
    path: "modifica-area/:idArea",
    element: <UpdateAreaPage />
  },
  {
    path: "crea-una-nuova-sottoarea",
    element: <CreateNewSottoareaPage />
  },
  {
    path: "crea-una-nuova-sottoarea/:idArea",
    element: <CreateNewSottoareaPage />
  },
  {
    path: "sottoaree/:idArea",
    element: <SottoareePage />
  },
  {
    path: "modifica-sottoarea/:idSottoarea",
    element: <UpdateSottoareaPage />
  },
  {
    path: "regolamento",
    element: <RegolamentoPage />
  },
  {
    path: "crea-una-nuova-regola",
    element: <CreateNewRegolaPage />
  },
  {
    path: "richieste",
    element: <RichiestePage />
  },
  {
    path: "richiesta/:idRichiesta",
    element: <RichiestaPage />
  },
  {
    path: "controllo-regole/:idRichiesta",
    element: <ControlloRegolePage />
  }
]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
