import React, { useEffect, useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDash = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total_data: 0,
  });
  const navigate = useNavigate();

  const fetchUsers = async (page = 1, term = '') => {
    setLoading(true);
    try {
      const token = Cookies.get('token');

      const response = await axios.get('https://gapakerem.vercel.app/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          search: term,
        }
      });

      const data = response.data.data;
      setUsers(data.users);
      setPagination(data.pagination);

    } catch (error) {
      console.error("Error :", error);
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
    fetchUsers();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchUsers(page, searchTerm);
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchUsers(1, searchTerm);
                }
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
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="py-4 px-6 text-gray-800">
                      {(pagination.current_page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="py-4 px-6 text-gray-800">{user.name}</td>
                    <td className="py-4 px-6 text-gray-600">{user.number}</td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate(`/user/${user.id}`)}
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

export default UserDash;
