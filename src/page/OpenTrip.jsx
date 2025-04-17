import React, { useEffect, useState } from 'react';
import { FaPen, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Pagination from '../components/Pagination'; // pastikan path sesuai

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

      if (data.status && data.data && Array.isArray(data.data.trips)) {
        setTrips(data.data.trips);
        setPagination(data.data.pagination);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
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
      if (!token) throw new Error('Token tidak ditemukan');

      const response = await fetch(`https://gapakerem.vercel.app/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus trip');
      }

      alert('Trip berhasil dihapus!');
      fetchTrips(pagination.current_page, searchTerm);
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert(`Gagal menghapus trip: ${error.message}`);
    }
  };

  const handleEdit = (tripId) => {
    navigate(`/edit-open-trip/${tripId}`);
  };

  const handleView = (tripId) => {
    navigate(`/view-open-trip/${tripId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Open Trip</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full py-2 px-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-yellow-400 text-white p-2 rounded-full"
            onClick={() => navigate('/add-open-trip')}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6">Nama Gunung</th>
                <th className="py-4 px-6">Harga Trip</th>
                <th className="py-4 px-6">Deskripsi</th>
                <th className="py-4 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <tr key={trip.id} className="border-b">
                    <td className="py-4 px-6">{trip.mountain_name}</td>
                    <td className="py-4 px-6">Rp {trip.price.toLocaleString()}</td>
                    <td className="py-4 px-6">{trip.description}</td>
                    <td className="py-4 px-6 flex space-x-2 justify-center">
                      <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => handleView(trip.id)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="bg-yellow-400 text-white p-2 rounded"
                        onClick={() => handleEdit(trip.id)}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded"
                        onClick={() => handleDelete(trip.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No trips found</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default OpenTrip;
