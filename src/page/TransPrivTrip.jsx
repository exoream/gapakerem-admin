import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 8;

const TranPrivTrip = () => {
  const [openTripData, setOpenTripData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total_data: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const token = Cookies.get('token');
        const response = await axios.get('https://gapakerem.vercel.app/bookings/?trip_type=private', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, search: searchTerm },
        });

        const bookings = response.data?.data?.bookings || [];
        const paginatedData = response.data?.pagination || { current_page: 1, last_page: 1, total_data: 0 };

        setPagination(paginatedData);

        const updatedBookings = await Promise.all(
          bookings.map(async (item) => {
            if (item.payment_proof && item.payment_status === 'unpaid') {
              try {
                await updatePaymentStatus(item.id, 'paid', token);
                return { ...item, payment_status: 'paid' };
              } catch (error) {
                console.error("Error Response:", error.response);
                toast.error(error.response.data.message, {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                });
              }
            }
            return item;
          })
        );

        setOpenTripData(updatedBookings);
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
  }, [currentPage]);

  if (loading) return <Loading />;

  const updatePaymentStatus = async (id, newStatus, token) => {
    await axios.patch(
      `https://gapakerem.vercel.app/bookings/${id}/status`,
      { payment_status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleDeleteData = (id) => {
    const updatedData = openTripData.filter((item) => item.id !== id);
    setOpenTripData(updatedData);
  };

  const handleViewData = (id) => {
    navigate(`/booking/private/${id}`);
  };

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  const filteredData = openTripData.filter((item) =>
    item.participant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="w-full p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Private Trip</h1>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-[#FFC100] transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchParams({ page: 1 });
                }}
                disabled={loading}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                  <td className="py-4 px-6 text-left font-semibold">No</td>
                  <th className="py-4 px-6 text-left font-semibold">Peserta</th>
                  <th className="py-4 px-6 text-left font-semibold">No. Hp</th>
                  <th className="py-4 px-6 text-left font-semibold">Gunung</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-4 px-6 text-gray-800">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="py-4 px-6 text-gray-800">{item.participant_name}</td>
                      <td className="py-4 px-6 text-gray-800">{item.phone_number}</td>
                      <td className="py-4 px-6 text-gray-800">{item.mountain_name}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold 
                            ${item.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                              item.payment_status === 'unpaid' ? 'bg-red-100 text-red-700' :
                                item.payment_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  item.payment_status === 'approved' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'}`}
                        >
                          {item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewData(item.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 aspect-square rounded-full transition-all transform hover:scale-110 flex items-center justify-center"
                            aria-label={`View booking ${item.participant_name}`}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>

                          <button
                            onClick={() => handleDeleteData(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 aspect-square rounded-full transition-all transform hover:scale-110 flex items-center justify-center"
                            aria-label={`Delete booking ${item.participant_name}`}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">Tidak ada transaksi yang ditemukan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.last_page > 1 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <ToastContainer
        className="absolute top-5 right-5"
      />
    </div>
  );
};

export default TranPrivTrip;
