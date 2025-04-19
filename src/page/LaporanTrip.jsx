import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const months = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const years = ['2023', '2024', '2025'];

const formatCurrency = (num) => {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const LaporanTrip = () => {
  const [selectedMonth, setSelectedMonth] = useState('04');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [openTripData, setOpenTripData] = useState([]);
  const [privateTripData, setPrivateTripData] = useState([]);
  const [totalOpenTrip, setTotalOpenTrip] = useState(0);
  const [totalPrivateTrip, setTotalPrivateTrip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');

        const response = await axios.get(
          `https://gapakerem.vercel.app/dashboard/monthly-trip-statistics?month=${parseInt(
            selectedMonth,
            10
          )}&year=${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.data;
        setOpenTripData(data.open_trip.trips);
        setPrivateTripData(data.private_trip.trips);
        setTotalOpenTrip(data.open_trip.total_price);
        setTotalPrivateTrip(data.private_trip.total_price);
        setError('');
      } catch (err) {
        console.error("Error Response:", err.response);
        toast.error(err.response?.data?.message || "Terjadi kesalahan", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleDownload = () => {
    const printUrl = `/print-report?month=${selectedMonth}&year=${selectedYear}`;

    window.open(printUrl, '_blank');
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Laporan</h1>
          <div className="flex items-center space-x-2">
            <span>Bulan</span>
            <select
              className='border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent'
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              className='border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent'
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold mb-2">Open Trip</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <th className="py-4 px-6 text-left font-semibold">Nama Gunung</th>
                    <th className="py-4 px-6 text-left font-semibold">Jumlah Peserta</th>
                    <th className="py-4 px-6 text-left font-semibold">Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {openTripData.map((trip, i) => (
                    <tr
                      key={i}
                      className={`border-b hover:bg-yellow-50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-gray-800">{trip.mountain_name}</td>
                      <td className="py-4 px-6 text-gray-800">{trip.total_participants}</td>
                      <td className="py-4 px-6 text-gray-800">{formatCurrency(trip.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Private Trip</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <th className="py-4 px-6 text-left font-semibold">Nama Gunung</th>
                    <th className="py-4 px-6 text-left font-semibold">Jumlah Peserta</th>
                    <th className="py-4 px-6 text-left font-semibold">Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {privateTripData.map((trip, i) => (
                    <tr
                      key={i}
                      className={`border-b hover:bg-yellow-50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-gray-800">{trip.mountain_name}</td>
                      <td className="py-4 px-6 text-gray-800">{trip.total_participants}</td>
                      <td className="py-4 px-6 text-gray-800">{formatCurrency(trip.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            className="bg-yellow-500 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-yellow-600 transition"
            onClick={handleDownload}
            aria-label="Download laporan PDF"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>

      <ToastContainer
        className="absolute top-5 right-5"
      />
    </div>
  );
};

export default LaporanTrip;