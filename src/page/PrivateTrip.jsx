import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateTrip = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total_data: 0,
  });
  const navigate = useNavigate();

  const fetchTrips = async (page = 1, term = '') => {
    setLoading(true);
    try {
      const response = await axios.get('https://gapakerem.vercel.app/trips/private', {
        params: {
          page: page,
          search: term,
        },
      });

      setTrips(response.data.data.trips);
      setPagination(response.data.data.pagination);

    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus trip ini?');
    if (!confirmed) return;

    try {
      const token = Cookies.get('token');

      const response = await axios.delete(`https://gapakerem.vercel.app/trips/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });

      fetchTrips(currentPage, searchTerm);

    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchTrips(page, searchTerm);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="flex flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Private Trip</h1>
          <div className='flex gap-5'>
            <button
              className="bg-[#FFC100] text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
              onClick={() => navigate('/add-private-trip')}
            >
              <FaPlus />
            </button>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari private trip..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-[#FFC100] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchTrips(1, searchTerm);
                  }
                }}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">No</th>
                <th className="py-4 px-6 text-left font-semibold">Nama Gunung</th>
                <th className="py-4 px-6 text-left font-semibold">Harga Trip</th>
                <th className="py-4 px-6 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {trips.length > 0 ? (
                trips.map((trip, index) => (
                  <tr
                    key={trip.id}
                    className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="py-4 px-6 text-gray-800">
                      {(pagination.current_page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="py-4 px-6 text-gray-800">{trip.mountain_name}</td>
                    <td className="py-4 px-6 text-gray-800">Rp {trip.price.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-500 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => navigate(`/view-private-trip/${trip.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-500 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleDelete(trip.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">Tidak ada trip yang ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={handlePageChange}
        />
      </div>

      <ToastContainer className="absolute top-5 right-5" />
    </div>
  );
};

export default PrivateTrip;
