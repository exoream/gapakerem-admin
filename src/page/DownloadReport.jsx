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
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 font-sans shadow-lg">

      <div className="relative mb-8">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-300" />
        <div className="pt-8 pb-4 flex justify-between items-center border-b-2 border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Laporan Trip</h1>
            <p className="text-gray-600 text-lg mt-1">{getMonthName(month)} {year}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-extrabold text-xl leading-tight text-orange-600">GaPakeRem</p>
              <p className="font-bold text-lg leading-tight text-gray-700">Adventure</p>
            </div>
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8 flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Trip</p>
          <p className="font-bold text-2xl text-gray-800">{totalTrip}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Open Trip</p>
          <p className="font-bold text-2xl text-gray-800">{openTrip.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Private Trip</p>
          <p className="font-bold text-2xl text-gray-800">{privateTrip.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Pendapatan</p>
          <p className="font-bold text-2xl text-orange-600">{formatCurrency(totalKeseluruhan)}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <h2 className="font-bold text-lg text-gray-800">Open Trip</h2>
          <span className="bg-orange-100 text-orange-800 border border-orange-300 rounded-full px-3 py-1 text-sm font-medium">
            {openTrip.length} Trip
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-gray-600 font-semibold">Nama Gunung</th>
                <th className="px-4 py-3 text-gray-600 font-semibold text-center">Jumlah Peserta</th>
                <th className="px-4 py-3 text-gray-600 font-semibold text-right">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {openTrip.map((trip, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{trip.mountain_name}</td>
                  <td className="px-4 py-3 text-center">{trip.total_participants}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(trip.total_price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-orange-50">
              <tr>
                <td colSpan="2" className="px-4 py-3 font-semibold text-right">Total Open Trip</td>
                <td className="px-4 py-3 font-bold text-right text-orange-700">{formatCurrency(totalOpen)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <h2 className="font-bold text-lg text-gray-800">Private Trip</h2>
          <span className="bg-blue-100 text-blue-800 border border-blue-300 rounded-full px-3 py-1 text-sm font-medium">
            {privateTrip.length} Trip
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-gray-600 font-semibold">Nama Gunung</th>
                <th className="px-4 py-3 text-gray-600 font-semibold text-center">Jumlah Peserta</th>
                <th className="px-4 py-3 text-gray-600 font-semibold text-right">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {privateTrip.map((trip, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{trip.mountain_name}</td>
                  <td className="px-4 py-3 text-center">{trip.total_participants}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(trip.total_price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-blue-50">
              <tr>
                <td colSpan="2" className="px-4 py-3 font-semibold text-right">Total Private Trip</td>
                <td className="px-4 py-3 font-bold text-right text-blue-700">{formatCurrency(totalPrivate)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-8 mb-6 bg-gray-800 text-white rounded-lg p-4 flex justify-between items-center">
        <div className="font-medium text-lg">Total Keseluruhan Pendapatan</div>
        <div className="font-bold text-2xl">{formatCurrency(totalKeseluruhan)}</div>
      </div>

      <div className="mt-12 flex justify-end">
        <div className="text-right w-64">
          <p className="text-gray-600">Makassar, {tanggal}</p>
          <div className="mt-12 mb-2 border-b border-gray-400 w-full" />
          <p className="font-bold text-gray-800">GaPakeRem Adventure</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadReport;