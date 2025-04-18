import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import Cookies from 'js-cookie';
import DownloadReport from './DownloadReport';
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
  const reportRef = useRef();

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
  }, [selectedMonth, selectedYear]);

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`laporan-${selectedYear}-${selectedMonth}.pdf`);
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
            onClick={downloadPDF}
            aria-label="Download laporan PDF"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>

      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={reportRef}>
          <DownloadReport
            month={selectedMonth}
            year={selectedYear}
            openTrip={openTripData}
            privateTrip={privateTripData}
            totalOpen={totalOpenTrip}
            totalPrivate={totalPrivateTrip}
          />
        </div>
      </div>

      <ToastContainer
        className="absolute top-5 right-5"
      />
    </div>
  );
};

export default LaporanTrip;
