import React, { useEffect, useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

const UserDash = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        const response = await axios.get('https://gapakerem.vercel.app/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.data.users);
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

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="flex flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Pengguna</h1>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-[#FFC100] transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">No</th>
                <th className="py-4 px-6 text-left font-semibold">Nama</th>
                <th className="py-4 px-6 text-left font-semibold">No. Hp</th>
                <th className="py-4 px-6 text-left font-semibold">Email</th>
                <th className="py-4 px-6 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-800">{user.name}</td>
                    <td className="py-4 px-6 text-gray-600">{user.number}</td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          aria-label={`View user ${user.name}`}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Tidak ada pengguna yang ditemukan</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UserDash;
