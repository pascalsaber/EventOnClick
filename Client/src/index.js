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

// Components
import PrintAll from './components/temp/printall'
import FindUserByID from './components/temp/findUserByID'
import AddUser from './components/temp/addUser'
import Test from './components/temp/test'
import Login from './components/login'
import Profile from './components/Profile'
import AddEvent from './components/addEvent'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<PrintAll />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/printall" element={<PrintAll />} />
      <Route path="/findUserByID" element={<FindUserByID />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/addEvent" element={<AddEvent />} />
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
