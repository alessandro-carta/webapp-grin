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
import CreateNewRegolaPage from './pages/regolamento/CreateNewRegolaPage.jsx'
import RichiestePage from './pages/richieste/RichiestePage.jsx'
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
import CreateNewInsegnamentoPage from './pages/dashboard/regolamenti/CreateNewInsegnamentoPage.jsx'
import UpdateInsegnamentoPage from './pages/dashboard/regolamenti/UpdateInsegnamentoPage.jsx'
import ControlloRegolePresidentePage from './pages/dashboard/regolamenti/ControlloRegolePresidentePage.jsx'
import CreateDuplicateRegolamentoPage from './pages/dashboard/regolamenti/CreateDuplicateRegolamentoPage.jsx'
import UpdateCDSPage from './pages/dashboard/corsidistudio/UpdateCDSPage.jsx'
import RegolamentoCDSPage from './pages/dashboard/regolamenti/RegolamentoCDSPage.jsx'
import RegolePage from './pages/regolamento/RegolePage.jsx'
import RegolamentoPage from './pages/richieste/RegolamentoPage.jsx'


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
    path: "p/:idPresidente",
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
    path: "a/:idArea/crea-una-nuova-sottoarea",
    element: <CreateNewSottoareaPage />
  },
  {
    path: "a/:idArea/sottoaree",
    element: <SottoareePage />
  },
  {
    path: "modifica-sottoarea/:idSottoarea",
    element: <UpdateSottoareaPage />
  },
  {
    path: "regolamento",
    element: <RegolePage />
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
    path: "r/:idRegolamento",
    element: <RegolamentoPage />
  },
  {
    path: "controllo-regole/:idRegolamento",
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
    path: "dashboard/c/:idCDS",
    element: <CorsoDiStudioPage />
  },
  {
    path: "dashboard/crea-un-nuovo-corso",
    element: <CreateNewCDSPage />
  },
  {
    path: "dashboard/modifica-corso/:idCDS",
    element: <UpdateCDSPage />
  },
  {
    path: "dashboard/c/:idCDS/crea-un-nuovo-regolamento",
    element: <CreateNewRegolamentoPage />
  },
  {
    path: "dashboard/r/:idRegolamento",
    element: <RegolamentoCDSPage />
  },
  {
    path: "dashboard/richieste",
    element: <RichiestePresidentePage />
  },
  {
    path: "dashboard/r/:idRegolamento/crea-un-nuovo-insegnamento",
    element: <CreateNewInsegnamentoPage />
  },
  {
    path: "dashboard/r/:idRegolamento/modifica-insegnamento/:idInsegnamento",
    element: <UpdateInsegnamentoPage />
  },
  {
    path: "dashboard/controllo-regole/:idRegolamento",
    element: <ControlloRegolePresidentePage />
  },
  {
    path: "dashboard/c/:idCDS/duplica-regolamento/:idRegolamento",
    element: <CreateDuplicateRegolamentoPage />
  }
]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
  
)
