import React, { useState } from 'react';
import { FaUser , FaMountain, FaChevronDown, FaReceipt, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.svg'; // Update the path to your logo
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isTripOpen, setIsTripOpen] = useState(false);
  const [isTransaksiOpen, setIsTransaksiOpen] = useState(false);

  const toggleTrip = () => {
    setIsTripOpen(!isTripOpen);
    if (isTransaksiOpen) setIsTransaksiOpen(false); // Close Transaksi if it's open
  };

  const toggleTransaksi = () => {
    setIsTransaksiOpen(!isTransaksiOpen);
    if (isTripOpen) setIsTripOpen(false); // Close Trip if it's open
  };

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard'); // Arahkan ke halaman dashboard
  };

  const handleLogout = () => {
    // Hapus sesi login (misalnya, hapus token dari local storage)
    localStorage.removeItem('token'); // Ganti dengan nama token yang sesuai
    navigate('/'); // Arahkan ke halaman login
  };


  return (
    <div className="w-1/5 bg-gray-200 h-full p-4 overflow-y-auto"> {/* Sidebar */}
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Logo" className="rounded-full" width="100" height="100" onClick={handleLogoClick} />
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="/user" className="flex items-center p-2 text-gray-700 rounded-lg">
              <FaUser  className="mr-2" />
              User
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 text-gray-700" onClick={toggleTrip}>
              <FaMountain className="mr-2" />
              Trip
              <FaChevronDown className={`ml-auto ${isTripOpen ? 'transform rotate-180' : ''}`} />
            </a>
            {isTripOpen && (
              <ul className="pl-4">
                <li className="mb-2">
                  <a href="/privtrip" className="flex items-center p-2 text-gray-600">
                    Private Trip
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/opentrip" className="flex items-center p-2 text-gray-600">
                    Open Trip
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 text-gray-700" onClick={toggleTransaksi}>
              <FaReceipt className="mr-2" />
              Transaksi
              <FaChevronDown className={`ml-auto ${isTransaksiOpen ? 'transform rotate-180' : ''}`} />
            </a>
            {isTransaksiOpen && (
              <ul className="pl-4">
                <li className="mb-2">
                  <a href="/booking-open" className="flex items-center p-2 text-gray-600">
                    Open Trip
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/booking-private" className="flex items-center p-2 text-gray-600">
                    Private Trip
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-4">
            <a href="/laporan" className="flex items-center p-2 text-gray-700">
              <FaFileAlt className="mr-2" />
              Laporan
            </a>
          </li>
          <li className="mb-4">
            <a href="/guideporter" className="flex items-center p-2 text-gray-700">
              <FaUsers className="mr-2" />
              Guide & Porter
            </a>
          </li>
          <li className="mt-auto">
            <a href="#" className="flex items-center p-2 text-gray-700" onClick={handleLogout}>
              <FaSignOutAlt className="mr-2" />
              Log out
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;