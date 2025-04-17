import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Pagination from '../components/Pagination'; 

const PrivateTrip = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('https://gapakerem.vercel.app/trips/private');
      const data = await response.json();
      if (data.status && data.data && Array.isArray(data.data.trips)) {
        setTrips(data.data.trips);
      } else {
        console.error('Expected an array but got:', data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
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

      setTrips(trips.filter((trip) => trip.id !== tripId));
      alert('Trip berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert(`Gagal menghapus trip: ${error.message}`);
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.mountain_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Private Trip</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full py-2 px-4"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            className="bg-yellow-400 text-white p-2 rounded-full flex items-center"
            onClick={() => navigate('/add-private-trip')}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-4 px-6">Nama Gunung</th>
            <th className="py-4 px-6">Harga Trip</th>
            <th className="py-4 px-6">Deskripsi</th>
            <th className="py-4 px-6">Gambar</th>
            <th className="py-4 px-6">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentTrips.length > 0 ? (
            currentTrips.map((trip) => (
              <tr key={trip.id} className="border-b">
                <td className="py-4 px-6">{trip.mountain_name}</td>
                <td className="py-4 px-6">Rp {trip.price.toLocaleString()}</td>
                <td className="py-4 px-6">{trip.description}</td>
                <td className="py-4 px-6">
                  <img src={trip.mountain_photo} alt="Trip" className="mx-auto" width="30" height="30" />
                </td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/view-private-trip/${trip.id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(trip.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No trips found</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PrivateTrip;
