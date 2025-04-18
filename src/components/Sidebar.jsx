import React, { useState } from 'react';
import { FaUser, FaMountain, FaChevronDown, FaReceipt, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.svg';
import Icon from '../assets/mount.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isTripOpen, setIsTripOpen] = useState(false);
  const [isTransaksiOpen, setIsTransaksiOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const toggleTrip = () => {
    setIsTripOpen(!isTripOpen);
    if (isTransaksiOpen) setIsTransaksiOpen(false);
  };

  const toggleTransaksi = () => {
    setIsTransaksiOpen(!isTransaksiOpen);
    if (isTripOpen) setIsTripOpen(false)
  };

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {

    const confirmDelete = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmDelete) {
      localStorage.removeItem('token');
      navigate('/')
    }
  };

  return (
    <div className="w-1/5 bg-gray-200 h-full p-4 overflow-y-auto">
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Logo" className="rounded-full transform transition duration-300 hover:scale-110" width="100" height="100" onClick={handleLogoClick} />
      </div>
      <nav>
        <ul className="font-medium">
          <li className="mb-4">
            <a
              href="/dashboard"
              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/dashboard") ? "bg-[#FFC100] text-white" : "text-gray-700 hover:bg-[#FFC100] hover:text-white"
                }`}
            >
              <FaFileAlt className="mr-2" />
              Dashboard
            </a>
          </li>

          <li className="mb-4">
            <a
              href="/user"
              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/user") ? "bg-[#FFC100] text-white" : "text-gray-700 hover:bg-[#FFC100] hover:text-white"
                }`}
            >
              <FaUser className="mr-2" />
              User
            </a>
          </li>

          <li className="mb-4">
            <a
              href="#"
              className="flex items-center p-2 text-gray-700 hover:bg-[#FFC100] hover:text-white rounded-lg transition-colors duration-200"
              onClick={toggleTrip}
            >
              <FaMountain className="mr-2" />
              Trip
              <FaChevronDown className={`ml-auto ${isTripOpen ? "transform rotate-180" : ""}`} />
            </a>
            {isTripOpen && (
              <ul className="pl-6">
                <li className="mb-2">
                  <a
                    href="/privtrip"
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/privtrip")
                      ? "bg-[#FFC100] text-white"
                      : "text-gray-600 hover:bg-[#FFC100] hover:text-white"
                      }`}
                  >
                    Private Trip
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/opentrip"
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/opentrip")
                      ? "bg-[#FFC100] text-white"
                      : "text-gray-600 hover:bg-[#FFC100] hover:text-white"
                      }`}
                  >
                    Open Trip
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li className="mb-4">
            <a
              href="#"
              className="flex items-center p-2 text-gray-700 hover:bg-[#FFC100] hover:text-white rounded-lg transition-colors duration-200"
              onClick={toggleTransaksi}
            >
              <FaReceipt className="mr-2" />
              Transaksi
              <FaChevronDown className={`ml-auto ${isTransaksiOpen ? "transform rotate-180" : ""}`} />
            </a>
            {isTransaksiOpen && (
              <ul className="pl-6">
                <li className="mb-2">
                  <a
                    href="/booking-open"
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/booking-open")
                      ? "bg-[#FFC100] text-white"
                      : "text-gray-600 hover:bg-[#FFC100] hover:text-white"
                      }`}
                  >
                    Open Trip
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/booking-private"
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/booking-private")
                      ? "bg-[#FFC100] text-white"
                      : "text-gray-600 hover:bg-[#FFC100] hover:text-white"
                      }`}
                  >
                    Private Trip
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li className="mb-4">
            <a
              href="/laporan"
              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/laporan") ? "bg-[#FFC100] text-white" : "text-gray-700 hover:bg-[#FFC100] hover:text-white"
                }`}
            >
              <FaFileAlt className="mr-2" />
              Laporan
            </a>
          </li>

          <li className="mb-4">
            <a
              href="/guideporter"
              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive("/guideporter")
                ? "bg-[#FFC100] text-white"
                : "text-gray-700 hover:bg-[#FFC100] hover:text-white"
                }`}
            >
              <FaUsers className="mr-2" />
              Guide & Porter
            </a>
          </li>

          <li className="mt-auto">
            <a
              href="#"
              className="flex items-center p-2 text-gray-700 hover:bg-[#FFC100] hover:text-white rounded-lg transition-colors duration-200"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Log out
            </a>
          </li>
        </ul>
      </nav>

      <img
        src={Icon}
        alt="background"
        className="absolute bottom-0 left-16 pointer-events-none"
      />
    </div>
  );
};

export default Sidebar;