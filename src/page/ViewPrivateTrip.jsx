import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPrivateTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`https://gapakerem.vercel.app/trips/${id}`);
        setTrip(res.data.data);
      } catch (err) {
        console.error("Gagal ambil detail trip:", err);
        alert("Gagal mengambil data trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) return <div className="text-center mt-4 text-gray-600">Loading...</div>;
  if (!trip || trip.trip_type !== "private") {
    return <div className="text-center mt-4 text-red-500">Trip tidak ditemukan atau bukan trip tipe open</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Detail Open Trip</h2>

      {trip.mountain_photo && (
        <img
          src={trip.mountain_photo}
          alt="Foto Gunung"
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Nama Gunung</label>
          <p className="border p-2 rounded bg-gray-50">{trip.mountain_name}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Harga</label>
          <p className="border p-2 rounded bg-gray-50">Rp {Number(trip.price).toLocaleString()}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Deskripsi</label>
          <p className="border p-2 rounded bg-gray-50 whitespace-pre-line">{trip.description}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Peralatan</label>
          <p className="border p-2 rounded bg-gray-50 whitespace-pre-line">{trip.equipment}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Estimasi Waktu</label>
          <p className="border p-2 rounded bg-gray-50">{trip.estimation_time}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Jam Keberangkatan</label>
          <p className="border p-2 rounded bg-gray-50">{trip.traveling_time}:00</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Agenda</label>
          <p className="border p-2 rounded bg-gray-50 whitespace-pre-line">{trip.agenda}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Guide</label>
          <p className="border p-2 rounded bg-gray-50">{trip.guide?.name || "Tidak ada"}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Porter</label>
          <p className="border p-2 rounded bg-gray-50">
            {trip.porters?.length > 0
              ? trip.porters.map((p) => p.name).join(", ")
              : "Tidak ada"}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/privtrip")}
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default ViewPrivateTrip;
