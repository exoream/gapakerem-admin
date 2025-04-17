import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Pastikan Anda mengimpor Cookies

const Login = () => {
  const [username, setUsername] = useState(''); // Mengganti email dengan username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(''); // Reset error sebelum melakukan permintaan

    try {
      const response = await axios.post('https://gapakerem.vercel.app/login', { username, password });
      const token = response.data.data.token; // Ambil token dari respons
      Cookies.set('token', token, { expires: 1 }); // Simpan token di cookies
      navigate('/dashboard'); // Arahkan ke halaman utama setelah berhasil login
    } catch (error) {
      console.error("Error Response:", error.response);
      setError(error.response?.data?.message || 'Login failed'); // Tampilkan pesan error
    } finally {
      setLoading(false); // Set loading ke false setelah permintaan selesai
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
              type="text" 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? 'Loading...' : 'Login'} {/* Tampilkan loading text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;