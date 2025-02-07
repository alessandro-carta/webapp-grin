import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import BolliniPage from './pages/bollini/BolliniPage.jsx'
import LoginAdminPage from './pages/auth/LoginAdminPage.jsx'
import PasswordChangePage from './pages/auth/PasswordChangePage.jsx'
import CorsiDiStudioPage from './pages/dashboard/corsidistudio/CorsiDiStudioPage.jsx'
import CreateNewCDSPage from './pages/dashboard/corsidistudio/CreateNewCDSPage.jsx'
import CorsoDiStudioPage from './pages/dashboard/corsidistudio/CorsoDiStudioPage.jsx'
import CreateNewRegolamentoPage from './pages/dashboard/regolamenti/CreateNewRegolamentoPage.jsx'
import BolliniPresidentePage from './pages/dashboard/bollini/BolliniPresidentePage.jsx'
import RichiestePresidentePage from './pages/dashboard/richieste/RichiestePresidentePage.jsx'
import CreateNewRichiestaPage from './pages/dashboard/richieste/CreateNewRichiestaPage.jsx'
import RichiestaPresidentePage from './pages/dashboard/richieste/RichiestaPresidentePage.jsx'
import CreateNewInsegnamentoPage from './pages/dashboard/richieste/CreateNewInsegnamentoPage.jsx'

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
  },
  {
    path: "bollini",
    element: <BolliniPage />
  },
  {
    path: "admin-login",
    element: <LoginAdminPage />
  },
  {
    path: "cambio-password",
    element: <PasswordChangePage />
  },
  {
    path: "dashboard/corsidistudio",
    element: <CorsiDiStudioPage />
  },
  {
    path: "dashboard/bollini",
    element: <BolliniPresidentePage />
  },
  {
    path: "dashboard/regolamenti/:idCDS",
    element: <CorsoDiStudioPage />
  },
  {
    path: "crea-un-nuovo-corso",
    element: <CreateNewCDSPage />
  },
  {
    path: "crea-un-nuovo-regolamento/:idCDS",
    element: <CreateNewRegolamentoPage />
  },
  {
    path: "dashboard/richieste",
    element: <RichiestePresidentePage />
  },
  {
    path: "crea-una-nuova-richiesta",
    element: <CreateNewRichiestaPage />
  },
  {
    path: "dashboard/richiesta/:idRichiesta",
    element: <RichiestaPresidentePage />
  },
  {
    path: "crea-un-nuovo-insegnamento/:idRichiesta",
    element: <CreateNewInsegnamentoPage />
  }
]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
