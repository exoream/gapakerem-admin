import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faTrash, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination'; // ✅ Import komponen pagination

const TranOpenTrip = () => {
  const [openTripData, setOpenTripData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupImage, setPopupImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token not found. Silakan login terlebih dahulu.');
        }

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
              } catch (err) {
                console.error(`Gagal update status untuk ID ${item.id}`, err);
              }
            }
            return item;
          })
        );

        setOpenTripData(updatedBookings);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data');
        setOpenTripData([]);
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

  const handleDeleteData = (id) => {
    const updatedData = openTripData.filter((item) => item.id !== id);
    setOpenTripData(updatedData);
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

  return (
    <div className="flex">
      <div className="w-full p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Open Trip</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search peserta"
              className="border rounded-full py-2 px-4 pl-10 w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              disabled={loading}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {loading && <div className="text-center py-4 text-gray-600">Loading data...</div>}

        {error && <div className="text-center py-4 text-red-600 font-semibold">{error}</div>}

        {!loading && !error && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Peserta</th>
                  <th className="py-2 px-4 border-b text-left">No. Hp</th>
                  <th className="py-2 px-4 border-b text-left">Gunung</th>
                  <th className="py-2 px-4 border-b text-center">Bukti Pembayaran</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  displayedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{item.participant_name}</td>
                      <td className="py-2 px-4 border-b">{item.phone_number}</td>
                      <td className="py-2 px-4 border-b">{item.mountain_name}</td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.payment_proof ? (
                          <button onClick={() => setPopupImage(item.payment_proof)}>
                            <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 hover:text-blue-600" />
                          </button>
                        ) : (
                          <span className="text-red-500">Belum Ada</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b capitalize">{item.payment_status}</td>
                      <td className="py-2 px-4 border-b text-center space-x-3">
                        <button
                          onClick={() => handleViewData(item.id)}
                          className="text-yellow-500 hover:text-yellow-600"
                          aria-label={`View booking ${item.participant_name}`}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleDeleteData(item.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label={`Delete booking ${item.participant_name}`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

       
        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Image Popup */}
        {popupImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setPopupImage(null)}
          >
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
              <img src={popupImage} alt="Bukti Pembayaran" className="w-full h-auto rounded" />
              <button
                onClick={() => setPopupImage(null)}
                className="mt-4 block mx-auto px-4 py-2 bg-yellow-400 text-white rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranOpenTrip;
