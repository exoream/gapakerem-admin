import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarked,
  faUsers,
  faExchangeAlt,
  faMoneyBillWave,
  faReceipt,
  faUserFriends,
  faCreditCard,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');

        const response = await axios.get('https://gapakerem.vercel.app/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setData(response.data.data);
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

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-100 p-5">
      {/* Header */}
      <div className="bg-white mb-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, <span className="text-yellow-500">Admin</span>
            </h1>
            <div className="w-1/3 h-2 rounded-lg bg-yellow-500"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Open Trips */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Open Trips</h3>
                <div className="text-yellow-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faMapMarked} size="lg" />
                </div>
              </div>
              <p className="text-4xl font-bold text-yellow-500">{data.total_open_trip}</p>
            </div>
            <div className="bg-yellow-500 h-1"></div>
          </div>

          {/* Private Trips */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Private Trips</h3>
                <div className="text-yellow-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faMapMarked} size="lg" />
                </div>
              </div>
              <p className="text-4xl font-bold text-yellow-500">{data.total_private_trip}</p>
            </div>
            <div className="bg-yellow-500 h-1"></div>
          </div>

          {/* Total Transaksi */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Total Transaksi</h3>
                <div className="text-yellow-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faExchangeAlt} size="lg" />
                </div>
              </div>
              <p className="text-4xl font-bold text-yellow-500">
                {data.total_open_trip_transactions + data.total_private_trip_transactions}
              </p>
            </div>
            <div className="bg-yellow-500 h-1"></div>
          </div>

          {/* Total Pendapatan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Total Pendapatan</h3>
                <div className="text-green-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faMoneyBillWave} size="lg" />
                </div>
              </div>
              <p className="text-4xl font-bold text-green-500">
                {new Intl.NumberFormat('id-ID').format(data.total_revenue)}
              </p>
            </div>
            <div className="bg-green-500 h-1"></div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Open Trip */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Detail Open Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-5 rounded-lg group hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Transaksi</span>
                  <div className="text-yellow-500 transform transition duration-300 group-hover:scale-125">
                    <FontAwesomeIcon icon={faReceipt} size="lg" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-bold text-yellow-600">
                  {data.total_open_trip_transactions}
                  <span className="text-sm font-normal text-gray-500 ml-1">Pesanan</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-5 rounded-lg group hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Partisipan</span>
                  <div className="text-yellow-500 transform transition duration-300 group-hover:scale-125">
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-bold text-yellow-600">
                  {data.total_open_trip_participants}
                  <span className="text-sm font-normal text-gray-500 ml-1">Orang</span>
                </div>
              </div>
            </div>
          </div>

          {/* Private Trip */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Detail Private Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-5 rounded-lg group hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Transaksi</span>
                  <div className="text-blue-500 transform transition duration-300 group-hover:scale-125">
                    <FontAwesomeIcon icon={faReceipt} size="lg" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-bold text-blue-600">
                  {data.total_private_trip_transactions}
                  <span className="text-sm font-normal text-gray-500 ml-1">Pesanan</span>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg group hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Partisipan</span>
                  <div className="text-blue-500 transform transition duration-300 group-hover:scale-125">
                    <FontAwesomeIcon icon={faUserFriends} size="lg" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-bold text-blue-600">
                  {data.total_private_trip_participants}
                  <span className="text-sm font-normal text-gray-500 ml-1">Orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Status Pembayaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-5 rounded-lg group hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Belum Membayar</span>
                <div className="text-red-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                </div>
              </div>
              <div className="mt-4 text-3xl font-bold text-red-600">
                {data.total_unpaid}
                <span className="text-sm font-normal text-gray-500 ml-1">Partisipan</span>
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-lg group hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Sudah Membayar</span>
                <div className="text-green-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                </div>
              </div>
              <div className="mt-4 text-3xl font-bold text-green-600">
                {data.total_paid}
                <span className="text-sm font-normal text-gray-500 ml-1">Partisipan</span>
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-lg group hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Total Pendapatan</span>
                <div className="text-green-500 transform transition duration-300 group-hover:scale-125">
                  <FontAwesomeIcon icon={faCreditCard} size="lg" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold text-green-600">
                Rp {new Intl.NumberFormat('id-ID').format(data.total_revenue)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;