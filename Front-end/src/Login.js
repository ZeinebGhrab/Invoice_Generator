import React, { useState} from 'react';
import {BiUserCircle} from 'react-icons/bi'
import axios from 'axios';
import App from './App';

export default function Login() {

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showMessage,setShowMessage]= useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password: password,
      });

      console.log('Logged in:', response.data);
      setUserName(response.data.user.username);
      localStorage.setItem('token', response.data.jwt);
      setIsLoggedIn(true); 
    } catch (error) {
      setShowMessage(true);  
      console.error('Login error:', error);
    }
  };
  const logout = () => {
    localStorage.removeItem('token-info');
    setIsLoggedIn(false);
};
  return (
    <div>
      {isLoggedIn ? (
         <>
         <App logout={logout} email={email} userName={userName}/>
         </>
      ) : (
        <div>
            <form onSubmit={handleLogin}>
<fieldset className="my-3 w-[600px] mx-auto mt-20 border border-gray-300 p-4 rounded-lg bg-gradient-to-br from-slate-200 to-red-300">
<div className='flex justify-center items-center mb-2'>
      <div className='text-6xl items-center justify-center text-center'>
        <BiUserCircle />
      </div>
    </div>
    <h1 className='text-2xl text-center font-bold mb-2 uppercase'>Member Login</h1>
  <div className="mb-4 mt-4">
    <label htmlFor="email" className="block p-2 text-m font-serif text-gray-900 dark:text-white">Email : </label>
    <input type="email" value={email} placeholder="Email"  onChange={(e) => setEmail(e.target.value)} id="email" className="bg-slate-50 border backdrop-blur-sm text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
  </div>
  <div className="mb-8">
    <label htmlFor="password" className="block p-2 text-m font-serif text-gray-900 dark:text-white">Password :</label>
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
  </div>
  {showMessage &&(
      <div class="m-1 p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">Verify your email and your password .</span> 
        </div>
            )}
  <div className='flex justify-center'>
    <button type="submit" className="py-3.5 px-6 text-m font-medium uppercase border-gray-700 text-white bg-gray-800 rounded-lg border  hover:bg-gray-700 hover:text-white focus:z-10 focus:ring-4 focus:outline-none focus:ring-white focus:text-white dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
    Login
      <svg className="w-4 h-5 text-white ml-1 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
      </svg>
    </button>
  
  </div>
</fieldset>
</form>
      </div>
      )}
    </div>
  );
};
 