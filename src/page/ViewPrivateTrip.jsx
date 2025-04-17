import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const ViewPrivateTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`https://gapakerem.vercel.app/trips/${id}`);
        setTrip(res.data.data);
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

    fetchTrip();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="p-10 flex items-center justify-center">
      <div className="w-2/3 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800">Detail Trip</h1>

        <div className="mt-10 flex justify-center">
          <a href={trip.mountain_photo} target="_blank" rel="noopener noreferrer">
            <img
              src={trip.mountain_photo}
              alt={trip.mountain_name}
              className="w-64 rounded-lg hover:opacity-80 transition"
            />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Nama Gunung</label>
          <input
            type="text"
            value={trip.mountain_name}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Harga</label>
          <input
            type="text"
            value={Number(trip.price).toLocaleString()}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Harga</label>
          <textarea
            type="text"
            value={trip.description}
            readOnly
            rows={4}
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Peralatan</label>
          <input
            type="text"
            value={trip.equipment}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 items-center gap-4">
          <label className="font-medium">Estimasi Waktu</label>
          <input
            type="text"
            value={trip.estimation_time}
            readOnly
            className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
          />
        </div>

        <button
          className="bg-[#FFC100] mt-5 text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
          onClick={() => navigate("/privtrip")}
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default ViewPrivateTrip;
