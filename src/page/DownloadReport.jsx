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
    <div className="max-w-[794px] mx-auto p-10 bg-white text-[#000] font-sans text-sm">
      
      {/* Decorative Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-orange-500 via-yellow-400 to-white z-0" />
        <div className="relative z-10 flex justify-between items-start pt-10 pb-4 border-b-4 border-gray-300">
          <div>
            <h1 className="text-2xl font-bold">Laporan Trip</h1>
            <p className="text-gray-500 mt-1">{getMonthName(month)}, {year}</p>
          </div>
          <div className="text-right flex items-center gap-2">
            <div>
              <p className="font-extrabold text-lg leading-tight">GaPakeRem</p>
              <p className="font-extrabold text-lg leading-tight">Adventure</p>
            </div>
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 rounded-full border-2 border-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Open Trip */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-semibold text-base">Open Trip</h2>
          <span className="border border-gray-400 rounded-full px-3 py-1 text-sm">
            {openTrip.length}
          </span>
        </div>
        <table className="w-full text-left mb-2">
          <thead className="border-y border-gray-300">
            <tr>
              <th className="py-2">Nama Gunung</th>
              <th className="py-2">Jumlah Peserta</th>
              <th className="py-2">Jumlah Transaksi</th>
            </tr>
          </thead>
          <tbody>
            {openTrip.map((trip, idx) => (
              <tr key={idx}>
                <td className="py-2">{trip.mountain_name}</td>
                <td className="py-2">{trip.total_participants}</td>
                <td className="py-2">{formatCurrency(trip.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-medium">Total Open Trip: {formatCurrency(totalOpen)}</div>
      </div>

      {/* Private Trip */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-semibold text-base">Private Trip</h2>
          <span className="border border-gray-400 rounded-full px-3 py-1 text-sm">
            {privateTrip.length}
          </span>
        </div>
        <table className="w-full text-left mb-2">
          <thead className="border-y border-gray-300">
            <tr>
              <th className="py-2">Nama Gunung</th>
              <th className="py-2">Jumlah Peserta</th>
              <th className="py-2">Jumlah Transaksi</th>
            </tr>
          </thead>
          <tbody>
            {privateTrip.map((trip, idx) => (
              <tr key={idx}>
                <td className="py-2">{trip.mountain_name}</td>
                <td className="py-2">{trip.total_participants}</td>
                <td className="py-2">{formatCurrency(trip.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-medium">Total Private Trip: {formatCurrency(totalPrivate)}</div>
      </div>

      {/* Total Summary */}
      <div className="border-t border-b py-4 flex justify-between items-center">
        <div>Total Keseluruhan Trip</div>
        <div className="font-semibold">{totalTrip} Trip</div>
      </div>
      <div className="border-b py-2 flex justify-between items-center">
        <div>Total Pendapatan</div>
        <div className="font-bold text-lg">{formatCurrency(totalKeseluruhan)}</div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-sm text-right">
        <p>Makassar, {tanggal}</p>
        <div className="mt-6 mb-2 border-t border-black w-1/3 ml-auto" />
        <p>GaPakeRem Adventure</p>
      </div>
    </div>
  );
};

export default DownloadReport;
