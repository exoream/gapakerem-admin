import React, { useEffect, useState } from 'react';
import { FaSearch, FaPen, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OpenTrip = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total_data: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTrips = async (page = 1, term = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gapakerem.vercel.app/trips/open?page=${page}&limit=8&search=${term}`
      );

      const data = await response.json();
      setTrips(data.data.trips);
      setPagination(data.data.pagination);

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

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTrips(1, searchTerm);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchTrips(page, searchTerm);
  };

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus trip ini?');
    if (!confirmed) return;

    try {
      const token = Cookies.get('token');

      const response = await fetch(`https://gapakerem.vercel.app/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Trip berhasil dihapus!');
      fetchTrips(pagination.current_page, searchTerm);

    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleEdit = (tripId) => {
    navigate(`/edit-open-trip/${tripId}`);
  };

  const handleView = (tripId) => {
    navigate(`/view-open-trip/${tripId}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="flex flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Open Trip</h1>
          <div className='flex gap-5'>
            <button
              className="bg-[#FFC100] text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
              onClick={() => navigate('/add-open-trip')}
            >
              <FaPlus />
            </button>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari open trip..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-[#FFC100] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-800">{trip.mountain_name}</td>
                    <td className="py-4 px-6 text-gray-800">Rp {trip.price.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-500 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleView(trip.id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleEdit(trip.id)}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all transform hover:scale-110"
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
                  <td colSpan="5" className="text-center py-8 text-gray-500">Tidak ada trip yang ditemukan</td>
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

        <ToastContainer
          className="absolute top-5 right-5"
        />
      </div>
    </div>
  );
};

export default OpenTrip;
