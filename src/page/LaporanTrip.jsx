import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import Cookies from 'js-cookie';
import DownloadReport from './DownloadReport';

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
        if (!token) throw new Error('Token not found');

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
        setError(err.response?.data?.message || err.message);
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
      scale: 2, // kualitas lebih tinggi
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
  
    // Tambahkan halaman pertama
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  
    // Tambahkan halaman berikutnya jika tinggi konten melebihi satu halaman
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  
    pdf.save(`laporan-${selectedYear}-${selectedMonth}.pdf`);
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Laporan</h1>
          <div className="flex items-center space-x-2">
            <span>Bulan</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
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
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Nama Gunung</th>
                  <th className="text-right py-2">Jumlah Peserta</th>
                  <th className="text-right py-2">Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {openTripData.map((trip, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-2">{trip.mountain_name}</td>
                    <td className="py-2 text-right">{trip.total_participants}</td>
                    <td className="py-2 text-right">{formatCurrency(trip.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Private Trip</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Nama Gunung</th>
                  <th className="text-right py-2">Jumlah Peserta</th>
                  <th className="text-right py-2">Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {privateTripData.map((trip, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-2">{trip.mountain_name}</td>
                    <td className="py-2 text-right">{trip.total_participants}</td>
                    <td className="py-2 text-right">{formatCurrency(trip.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-yellow-500 text-white p-4 rounded-full hover:bg-yellow-600 transition"
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
    </div>
  );
};

export default LaporanTrip;
