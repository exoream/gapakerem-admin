import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TranOpenTrip = () => {
  const [transaction, setTransaction] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total_data: 0,
  });
  const navigate = useNavigate();

  const fetchTransaction = async (page = 1, term = '') => {
    setLoading(true);
    try {
      const token = Cookies.get('token');

      const response = await axios.get('https://gapakerem.vercel.app/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          search: term,
          trip_type: "open"
        }
      });

      const data = response.data.data;
      setTransaction(data.bookings);
      setPagination(data.pagination);

    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.response?.data?.message || "Gagal memuat data", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchTransaction(page, searchTerm);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'paid':
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'unpaid':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="w-full p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Open Trip</h1>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-[#FFC100] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchTransaction(1, searchTerm);
                  }
                }}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                  <th className="py-4 px-6 text-left font-semibold">No</th>
                  <th className="py-4 px-6 text-left font-semibold">Peserta</th>
                  <th className="py-4 px-6 text-left font-semibold">No. Hp</th>
                  <th className="py-4 px-6 text-left font-semibold">Gunung</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaction.length > 0 ? (
                  transaction.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-4 px-6 text-gray-800">
                        {(pagination.current_page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="py-4 px-6 text-gray-800">{item.participant_name}</td>
                      <td className="py-4 px-6 text-gray-800">{item.phone_number}</td>
                      <td className="py-4 px-6 text-gray-800">{item.mountain_name}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClassName(item.payment_status)}`}
                        >
                          {formatStatus(item.payment_status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/booking/open/${item.id}`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 aspect-square rounded-full transition-all transform hover:scale-110 flex items-center justify-center"
                            aria-label={`View booking ${item.participant_name}`}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Tidak ada transaksi yang ditemukan</td>
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
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default TranOpenTrip;
