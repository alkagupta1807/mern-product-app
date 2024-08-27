import {BrowserRouter as Router,Routes,Route, Navigate} from "react-router-dom"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn"

import Home from "./pages/Home"
import UpdatePassword from "./pages/UpdatePassword"
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import { useAppContext } from "./contexts/AppContext"
import AddProduct from "./pages/AddProduct"
import AllProducts from "./pages/AllProducts"
import EditProduct from "./pages/EditProduct"
import Detail from "./pages/Detail"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';




function App() {
  const {isLoggedIn} =useAppContext()
 

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Layout><Home/></Layout>}/>
      <Route path="/register" element={<Layout><Register/></Layout>}/>
      <Route path="/sign-in" element={<Layout><SignIn/></Layout>}/>
      {/* <Route path="/verify-email" element={<Layout><VerifyEmail /></Layout>} /> */}
      {/* <Route path="/verify-email/:email/:token" element={<VerifyEmail />} /> */}
      <Route path="/verify-email/:email/:token" element={<SignIn />} />
      


      <Route path="/update-password" element={<Layout><UpdatePassword/></Layout>}/>
      <Route path="/forget-password" element={<Layout><ForgetPassword/></Layout>}/>
      <Route path="/reset-password/:token" element={<Layout><ResetPassword/></Layout>}/>
      {isLoggedIn && <>
        <Route path="/add-product" element={<Layout><AddProduct/></Layout>}/>
        <Route path="/my-products" element={<Layout><AllProducts/></Layout>}/>
        <Route path="/edit-product/:id" element={<Layout><EditProduct/></Layout>}/>
        <Route path="/detail/:id" element={<Layout><Detail/></Layout>}/>
       

      </>
        }
    <Route path="*" element={<Navigate to ="/"/>}/>
    </Routes>
    <ToastContainer /> 
   </Router>
  )
}

export default App
