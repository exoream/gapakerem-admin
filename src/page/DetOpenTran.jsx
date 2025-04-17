import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '../components/Loading';
import Loading2 from '../components/Loading2';

const DetailOpenTransaksi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');

        const response = await axios.get(`https://gapakerem.vercel.app/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data.data);

      } catch (error) {
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

    fetchDetail();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const token = Cookies.get('token');

      const response = await axios.patch(
        `https://gapakerem.vercel.app/bookings/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData((prev) => ({
        ...prev,
        payment_status: newStatus,
      }));
      alert(`Status berhasil diubah menjadi ${newStatus === 'approved' ? 'Diterima' : 'Ditolak'}`);

    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !data) return <Loading />;

  const {
    participant_name,
    phone_number,
    mountain_name,
    total_price,
    meeting_point,
    payment_proof,
    status,
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
    <div className="p-10 flex items-center justify-center">
      <div className="w-2/3 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800">Detail Transaksi</h1>

        <div className="mt-10 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Nama Partisipan</label>
          <input
            type="text"
            value={participant_name}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">No. HP</label>
          <input
            type="text"
            value={phone_number}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Nama Gunung</label>
          <input
            type="text"
            value={mountain_name}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Harga</label>
          <input
            type="text"
            value={formatCurrency(total_price)}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Meeting Point</label>
          <input
            type="text"
            value={meeting_point}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Bukti Pembayaran</label>
          {payment_proof ? (
            <a href={payment_proof} target="_blank" rel="noopener noreferrer" className='col-span-2'>
              <img
                src={payment_proof}
                alt="Bukti Pembayaran"
                className="w-64 rounded-lg hover:opacity-80 transition"
              />
            </a>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">Belum Ada</span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Status</label>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${status === 'paid' ? 'bg-green-100 text-green-700' :
                status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                  status === 'rejected' ? 'bg-red-100 text-red-700' :
                    status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="bg-[#FFC100] mt-5 text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200">
            Kembali
          </button>

          <span className="text-gray-500">{formatDate(created_at)}</span>

          {updating ? (
            <Loading2 />
          ) : status === 'paid' && (
            <div>
              <button
                onClick={() => updateStatus('approved')}
                className="bg-green-500 mt-5 text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-green-600 transition-all duration-200"
              >
                Terima
              </button>

              <button
                onClick={() => updateStatus('rejected')}
                className="bg-red-500 ml-5 mt-5 text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-red-600 transition-all duration-200"
              >
                Tolak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailOpenTransaksi;
