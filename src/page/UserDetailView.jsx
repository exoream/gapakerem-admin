import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const UserDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const token = Cookies.get('token');

        const response = await axios.get(`https://gapakerem.vercel.app/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data.data);
      } catch (error) {
        console.error("Error Response:", error.response);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10 flex items-center justify-center">
      <div className="w-2/3 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800">Detail Pengguna</h1>

        <div className="relative flex justify-center mb-5 mt-10">
          {user.photo ? (
            <img
              src={user.photo}
              className="w-32 h-32 object-cover rounded-full border border-gray-300"
              alt="Profile"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-white" />
          )}
        </div>

        <div className="mt-10 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Nama</label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Username</label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Email</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">No. HP</label>
          <input
            type="text"
            value={user.number}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <button
          onClick={handleBack}
          className="bg-[#FFC100] mt-5 text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default UserDetailView;
