// ספריה מובנת לצורך בדיקה של ביצועי מערכת 
//import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import "./styles.css";

// User Components
import Register from './components/User/Register'
import Login from './components/User/Login'
import Logoff from './components/User/Logoff'
import Profile from './components/User/Profile'

// Admin Components
import PrintAll from './components/Admin/printall'
import AllProducts from "./components/Admin/AllProducts.js";
import AllUserEvents from "./components/Admin/AllUserEvents.js";
// Event Components
import AddEvent from './components/Event/addEvent'
import SelectAMeal from './components/Event/selectAMeal.js'
import SelectADecoration from './components/Event/selectADecoration.js'
import AllEvents from "./components/Event/AllEvents";
import Payment from "./components/Event/payment.js";



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<Login />} />
      {/*User*/}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logoff" element={<Logoff />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/logoff" element={<Profile />} />
      {/*Event*/}
      <Route path="/allEvents" element={<AllEvents />} />
      <Route path="/addEvent" element={<AddEvent />} />
      <Route path="/selectAMeal" element={<SelectAMeal />} />
      <Route path="/selectADecoration" element={<SelectADecoration />} />
      <Route path="/payment" element={<Payment />} />
      {/*Admin*/}
      <Route path="/printall" element={<PrintAll />} />
      <Route path="/allproducts" element={<AllProducts />} />
      <Route path="/allUserEvents" element={<AllUserEvents />} />

   
    </>
  )
);
//<RouterProvider router={router} />
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
