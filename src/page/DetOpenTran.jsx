import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DetailOpenTransaksi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('Token tidak ditemukan, silakan login.');

        const response = await axios.get(`https://gapakerem.vercel.app/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status && response.data.data) {
          setData(response.data.data);
        } else {
          setError('Data tidak ditemukan');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const updateStatus = async (newStatus) => {
    const currentStatus = data?.status?.toLowerCase();
    const hasProof = !!data?.payment_proof;

    if (!hasProof || currentStatus !== 'paid') {
      alert('Status hanya dapat diubah jika sudah ada bukti pembayaran dan status saat ini adalah "paid".');
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('Token tidak ditemukan, silakan login.');

      const response = await axios.patch(
        `https://gapakerem.vercel.app/bookings/${id}/status`,
        { status: newStatus }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      

      if (response.data.status) {
        setData((prev) => ({
          ...prev,
          payment_status: newStatus,
        }));
        alert(`Status berhasil diubah menjadi ${newStatus === 'approved' ? 'Diterima' : 'Ditolak'}`);
      } else {
        alert('Gagal mengubah status');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading detail transaksi...</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
          Kembali
        </button>
      </div>
    );

  if (!data) return null;

  const {
    participant_name,
    phone_number,
    mountain_name,
    total_price,
    meeting_point,
    payment_proof,
    status, // Ganti payment_status menjadi status
    created_at,
  } = data;
  

  const formatCurrency = (num) => (num ? 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '-');
  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString('id-ID') : '-');

  const isActionAllowed =
  !!payment_proof && String(status).toLowerCase().trim() === 'paid';


  console.log('DEBUG payment_status:', status);
  console.log('DEBUG payment_proof:', payment_proof);
  console.log('DEBUG isActionAllowed:', isActionAllowed);

  return (
    <div className="flex">
      <div className="w-4/5 p-8">
        <h1 className="text-2xl font-bold mb-8">Detail Transaksi</h1>
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center">
            <span className="w-1/4 font-semibold">Peserta</span>
            <input className="w-3/4 p-2 border rounded-full" readOnly type="text" value={participant_name || '-'} />
          </div>
          <div className="flex items-center">
            <span className="w-1/4 font-semibold">No Hp</span>
            <input className="w-3/4 p-2 border rounded-full" readOnly type="text" value={phone_number || '-'} />
          </div>
          <div className="flex items-center">
            <span className="w-1/4 font-semibold">Nama Gunung</span>
            <input className="w-3/4 p-2 border rounded-full" readOnly type="text" value={mountain_name || '-'} />
          </div>
          <div className="flex items-center">
            <span className="w-1/4 font-semibold">Harga</span>
            <input className="w-3/4 p-2 border rounded-full" readOnly type="text" value={formatCurrency(total_price)} />
          </div>
          <div className="flex items-center">
            <span className="w-1/4 font-semibold">Meeting Point</span>
            <input className="w-3/4 p-2 border rounded-full" readOnly type="text" value={meeting_point || '-'} />
          </div>
          <div className="flex items-center">
            <span className="w-1/4 font-semibold">Bukti Pembayaran</span>
            <div className="w-3/4">
              {payment_proof ? (
                <img src={payment_proof} alt="Bukti Pembayaran" className="border rounded" width="100" height="100" />
              ) : (
                <span className="text-red-500">Belum Ada</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center max-w-xl">
          <span className="text-gray-500">{formatDate(created_at)}</span>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Status</span>
            <span
              className={`font-semibold ${
                status === 'approved'
                  ? 'text-green-600'
                  : status === 'rejected'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {status === 'approved'
                ? 'Diterima'
                : status === 'rejected'
                ? 'Ditolak'
                : 'Menunggu Aksi'}
            </span>

            <button
              onClick={() => updateStatus('approved')}
              disabled={!payment_proof || status !== 'paid' || updating}
              className={`px-4 py-2 rounded text-white transition ${
                payment_proof && status === 'paid' && !updating
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {updating && status !== 'approved' ? 'Memproses...' : 'Terima'}
            </button>

            <button
              onClick={() => updateStatus('rejected')}
              disabled={!payment_proof || status !== 'paid' || updating}
              className={`px-4 py-2 rounded text-white transition ${
                payment_proof && status === 'paid' && !updating
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {updating && status !== 'rejected' ? 'Memproses...' : 'Tolak'}
            </button>

          </div>
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
          Kembali
        </button>
      </div>
    </div>
  );
};

export default DetailOpenTransaksi;
