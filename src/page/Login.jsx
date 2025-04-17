import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Icon from "../assets/mount.png"
import Loading from '../components/Loading2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://gapakerem.vercel.app/login', { username, password });
      const token = response.data.data.token;
      Cookies.set('token', token, { expires: 1 });
      navigate('/dashboard');

    } catch (error) {
      console.error("Error :", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="relative">
          <img
            src={Icon}
            className='h-20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-25'
          />

          <h1 className="text-3xl font-bold text-[#FFC100] mb-8 text-center">
            Selamat Datang, Admin!
          </h1>
        </div>

        <form onSubmit={handleLogin} className='mt-20'>
          <div className="mb-5 grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-gray-500" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-5 grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-gray-500" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-10 flex justify-center">
            {loading ? (
              <Loading />
            ) : (
              <button
                type="submit"
                className="w-1/2 bg-[#FFC100] text-white py-3 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
                disabled={loading}
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>

      <ToastContainer
        className="absolute top-5 right-5"
      />
    </div>
  );
};

export default Login;