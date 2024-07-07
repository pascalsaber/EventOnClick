// ספריה מובנת לצורך בדיקה של ביצועי מערכת 
//import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import "./styles.css";

// User Components
import Register from './components/User/Register'
import Login from './components/User/Login'
import Logoff from './components/User/Logoff'
import Profile from './components/User/Profile'

// Admin Components
import PrintAll from './components/temp/printall'
import FindUserByID from './components/temp/findUserByID'
import Test from './components/temp/test'

// Event Components
import AddEvent from './components/addEvent'
import AllEvents from "./components/User/AllEvents";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logoff" element={<Logoff />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/logoff" element={<Profile />} />
      <Route path="/printall" element={<PrintAll />} />
      <Route path="/findUserByID" element={<FindUserByID />} />
      <Route path="/test" element={<Test />} />
      <Route path="/addEvent" element={<AddEvent />} />
      <Route path="/allEvents" element={<AllEvents />} />
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
