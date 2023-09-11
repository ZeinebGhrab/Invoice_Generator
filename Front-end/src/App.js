import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {BsFillPersonLinesFill} from "react-icons/bs"
import AddInvoice from "./components/AddInvoice";
import ShowInvoices from "./components/ShowInvoices";
import Login from "./Login";
import zetaLogo from './logo.png';
import { useState } from "react";
import Dropdown from "./components/Dropdown";

export default function App({logout,email,userName}) {
  const [open,setOpen]=useState(false);
  return (
    <BrowserRouter>  
<nav className="z-20 border-b border-gray-300 m-2 rounded-md shadow-sm bg-gradient-to-br from-slate-100 to-gray-100">
  <div className="max-w-screen-xl flex flex-wrap justify-between mx-auto p-2">
  <ul className="flex items-center">
      <img src={zetaLogo} class="h-12 mr-1" alt="zeta Logo"/>
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Invoice Generator</span>
  </ul>
    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="text-lg flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-6 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    <div className="flex md:order-2 ml-6">
      <button onClick={()=>{setOpen(open === true ? false : true)}} type="button" className="flex hover:text-gray-500 hover:border-gray-500 border-b border-gray-600 text-2xl text-center md:mr-0" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <span className="sr-only">Open user menu</span>
        <BsFillPersonLinesFill/>
      </button>
      {open && <Dropdown signout={logout} email={email} userName={userName}/>}
    </div>
      <li>
        <Link to='/' className="border-b border-gray-700 block py-2 pl-3 pr-4 hover:text-gray-500 hover:border-gray-500 md:p-0 text-gray-700" aria-current="page">
            Home
        </Link>
      </li>
      <li>
        <Link to='/addInvoice' className="border-b border-gray-700 block py-2 pl-3 pr-4 hover:text-gray-500 hover:border-gray-500 md:p-0 text-gray-700" >
            Add Invoice
        </Link>
      </li>
      </ul>
      </div>
      </div>
</nav>
      <Routes>
        <Route path="/" exact element={<ShowInvoices />} />
        <Route path="/addInvoice" exact element={<AddInvoice />} />
        <Route exact path="/login" component={Login} />
      </Routes>
    </BrowserRouter>
  );
}
