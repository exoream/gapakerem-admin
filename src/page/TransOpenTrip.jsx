import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faTrash, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TranOpenTrip = () => {
  const [openTripData, setOpenTripData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');

        const response = await axios.get('https://gapakerem.vercel.app/bookings/?trip_type=open', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookings = response.data?.data?.bookings || [];

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
  }, [location]);

  const updatePaymentStatus = async (id, newStatus, token) => {
    await axios.patch(
      `https://gapakerem.vercel.app/bookings/${id}/status`,
      { payment_status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const handleViewData = (id) => {
    navigate(`/booking/open/${id}`);
  };

  const filteredData = openTripData.filter((item) =>
    item.participant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
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
                {displayedData.length > 0 ? (
                  displayedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                      <td className="py-4 px-6 text-gray-800">{item.participant_name}</td>
                      <td className="py-4 px-6 text-gray-800">{item.phone_number}</td>
                      <td className="py-4 px-6 text-gray-800">{item.mountain_name}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold 
                            ${item.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                              item.payment_status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                                item.payment_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  item.payment_status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'}`}
                        >
                          {item.payment_status}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>
      </div>

      <ToastContainer
        className="absolute top-5 right-5"
      />
    </div >
  );
};

export default TranOpenTrip;
