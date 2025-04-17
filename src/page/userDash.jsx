import React, { useEffect, useState } from 'react';
import { FaSearch, FaArrowRight, FaArrowLeft, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

const UserDash = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('Token not found');
        const response = await axios.get('https://gapakerem.vercel.app/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status) {
          setUsers(response.data.data.users);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleViewUser = (id) => {
    navigate(`/user/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <div className="w-4/5 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full py-2 px-4 pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 border-r">Nama</th>
              <th className="py-4 px-6 border-r">No. Hp</th>
              <th className="py-4 px-6 border-r">Email</th>
              <th className="py-4 px-6">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-4 px-6 border-r">{user.name}</td>
                  <td className="py-4 px-6 border-r">{user.number}</td>
                  <td className="py-4 px-6 border-r">{user.email}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="text-yellow-500 hover:text-yellow-600"
                      aria-label={`View user ${user.name}`}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserDash;
