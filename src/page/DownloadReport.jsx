import React from "react";
import logo from '../assets/logo.svg';

const formatCurrency = (num) => {
  return num.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).replace(',00', '');
};

const getMonthName = (value) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[parseInt(value, 10) - 1];
};

const DownloadReport = ({ month, year, openTrip, privateTrip, totalOpen, totalPrivate }) => {
  const totalKeseluruhan = totalOpen + totalPrivate;
  const totalTrip = openTrip.length + privateTrip.length;

  const currentDate = new Date();
  const tanggal = `${currentDate.getDate()} ${getMonthName(
    (currentDate.getMonth() + 1).toString().padStart(2, '0')
  )} ${currentDate.getFullYear()}`;

  return (
    <div className="bg-white text-gray-800 font-serif" style={{ width: "800px", margin: "0 auto" }}>
      <div style={{ padding: "30px" }}>
        <div className="mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10"
              />
              <div>
                <p className="font-bold text-lg">GaPakeRem Adventure</p>
                <p className="text-sm text-gray-600">Laporan Bulanan</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tanggal: {tanggal}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">LAPORAN TRIP</h1>
          <p className="text-gray-600">{getMonthName(month)} {year}</p>
        </div>

        <div className="mb-8 border border-gray-300 p-4">
          <h2 className="text-lg font-bold mb-2">Ringkasan</h2>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1">Total Trip</td>
                <td className="py-1 text-right">{totalTrip}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Open Trip</td>
                <td className="py-1 text-right">{openTrip.length}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Private Trip</td>
                <td className="py-1 text-right">{privateTrip.length}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Total Pendapatan</td>
                <td className="py-1 text-right font-bold">{formatCurrency(totalKeseluruhan)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Open Trip ({openTrip.length})</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-left">Nama Gunung</th>
                <th className="border border-gray-300 p-1 text-center">Jumlah Peserta</th>
                <th className="border border-gray-300 p-1 text-right">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {openTrip.map((trip, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 p-1">{trip.mountain_name}</td>
                  <td className="border border-gray-300 p-1 text-center">{trip.total_participants}</td>
                  <td className="border border-gray-300 p-1 text-right">{formatCurrency(trip.total_price)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan="2" className="border border-gray-300 p-1 text-right">Total Open Trip</td>
                <td className="border border-gray-300 p-1 text-right">{formatCurrency(totalOpen)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ pageBreakBefore: "auto", pageBreakAfter: "auto" }}></div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Private Trip ({privateTrip.length})</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-left">Nama Gunung</th>
                <th className="border border-gray-300 p-1 text-center">Jumlah Peserta</th>
                <th className="border border-gray-300 p-1 text-right">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {privateTrip.map((trip, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 p-1">{trip.mountain_name}</td>
                  <td className="border border-gray-300 p-1 text-center">{trip.total_participants}</td>
                  <td className="border border-gray-300 p-1 text-right">{formatCurrency(trip.total_price)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan="2" className="border border-gray-300 p-1 text-right">Total Private Trip</td>
                <td className="border border-gray-300 p-1 text-right">{formatCurrency(totalPrivate)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8 border-t border-b border-gray-300 py-2">
          <div className="flex justify-between">
            <div className="font-bold">Total Keseluruhan Pendapatan</div>
            <div className="font-bold">{formatCurrency(totalKeseluruhan)}</div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <div className="flex justify-end">
            <div className="text-right w-64">
              <p>Makassar, {tanggal}</p>
              <div className="mt-10 mb-1 border-b border-gray-400 w-full"></div>
              <p className="font-bold">GaPakeRem Adventure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadReport;