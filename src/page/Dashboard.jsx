import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Impor axios
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading ke true saat memulai fetch
      try {
        const token = Cookies.get('token'); // Ambil token dari cookies
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('https://gapakerem.vercel.app/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`, // Kirim token dalam header
          },
        });

        setData(response.data.data); // Ambil data dari respons
      } catch (err) {
        setError(err.response?.data?.message || err.message); // Tampilkan pesan error
      } finally {
        setLoading(false); // Set loading ke false setelah permintaan selesai
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome, <span className="text-yellow-500">Admin</span>
          </h1>
          <div className="w-1/3 h-4 rounded-lg bg-yellow-500"></div>
        </div>
        <div className="space-y-8">
          {/* Jumlah Peserta */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Jumlah Peserta</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded">Open Trip</span>
                  <div className="text-4xl font-bold text-yellow-500 mt-2">{data.total_open_trip_participants}</div>
                  <div className="text-gray-700">Peserta</div>
                </div>
              </div>
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded">Private Trip</span>
                  <div className="text-4xl font-bold text-yellow-500 mt-2">{data.total_private_trip_participants}</div>
                  <div className="text-gray-700">Peserta</div>
                </div>
              </div>
            </div>
          </div>
          {/* Transaksi */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Transaksi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded">Peserta Belum Membayar</div>
                  <div className="text-4xl font-bold text-yellow-500 mt-2">{data.total_unpaid}</div>
                  <div className="text-gray-700">Peserta</div>
                </div>
              </div>
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded">Total Pendapatan</div>
                  <div className="text-4xl font-bold text-yellow-500 mt-2">{data.total_revenue}</div>
                  <div className="text-gray-700">Rupiah</div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
 
  );
};

export default Dashboard;