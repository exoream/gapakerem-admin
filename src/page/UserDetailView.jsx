import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');

      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await axios.get(`https://gapakerem.vercel.app/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status) {
          setUser(response.data.data);
        } else {
          setError('User tidak ditemukan');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="flex justify-center p-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-yellow-600">Detail Pengguna</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-600 text-sm">Nama:</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Username:</p>
            <p className="text-lg font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email:</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Nomor HP:</p>
            <p className="text-lg font-medium">{user.number}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600 text-sm mb-2">Foto Profile:</p>
            <img
              src={user.photo || 'https://placehold.co/100x100?text=No+Image'}
              alt="User Profile"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>
        <button
          onClick={handleBack}
          className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default UserDetailView;
