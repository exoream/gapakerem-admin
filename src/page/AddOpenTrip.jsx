import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AddOpenTrip = () => {
  const [formData, setFormData] = useState({
    mountain_name: "",
    mountain_photo: null,
    description: "",
    equipment: "",
    estimation_time: "",
    price: "",
    trip_type: "open",
    traveling_time: "",
    agenda: "",
    id_guide: "",
    porter_ids: [],
  });

  const [guides, setGuides] = useState([]);
  const [porters, setPorters] = useState([]);
  const navigate = useNavigate();

  const fetchGuides = async () => {
    try {
      const res = await axios.get("https://gapakerem.vercel.app/guides");
      setGuides(res.data.data.guides);
    } catch (error) {
      console.error("Gagal ambil data guide:", error);
    }
  };

  const fetchPorters = async () => {
    try {
      const res = await axios.get("https://gapakerem.vercel.app/porters");
      setPorters(res.data.data.porters);
    } catch (error) {
      console.error("Gagal ambil data porter:", error);
    }
  };

  useEffect(() => {
    fetchGuides();
    fetchPorters();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (name === "mountain_photo") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "porter_ids") {
      const selected = [...formData.porter_ids];
      const valueInt = parseInt(value);
      if (selected.includes(valueInt)) {
        setFormData({
          ...formData,
          porter_ids: selected.filter((id) => id !== valueInt),
        });
      } else {
        setFormData({
          ...formData,
          porter_ids: [...selected, valueInt],
        });
      }
    } else {
      setFormData({ ...formData, [name]: type === "number" ? parseInt(value) : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = Cookies.get("token");
  
    const formDataToSend = new FormData();
    formDataToSend.append("mountain_name", formData.mountain_name);
    formDataToSend.append("mountain_photo", formData.mountain_photo); // File
    formDataToSend.append("description", formData.description);
    formDataToSend.append("equipment", formData.equipment);
    formDataToSend.append("estimation_time", formData.estimation_time);

    // ✅ pastikan price adalah number
    formDataToSend.append("price", Number(formData.price)); 
    formDataToSend.append("trip_type", "open");

    // ✅ open_trip butuh number untuk id_guide dan porters
    const openTripData = {
      traveling_time: formData.traveling_time,
      agenda: formData.agenda,
      id_guide: Number(formData.id_guide), // <- ini penting
      porters: formData.porter_ids.map((id) => Number(id)), // <- ini juga penting
    };

    formDataToSend.append("open_trip", JSON.stringify(openTripData));

  
    try {
      const res = await axios.post(
        "https://gapakerem.vercel.app/trips/open",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      alert("Trip berhasil ditambahkan!");
      console.log(res.data);
      navigate("/opentrip");
    } catch (err) {
      console.error("Gagal tambah trip:", err.response?.data || err.message);
      alert("Gagal tambah trip: " + (err.response?.data?.message || "Unknown Error"));
    }
  };
  
  

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Tambah Open Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="mountain_name"
          placeholder="Nama Gunung"
          className="w-full border p-2 rounded"
          value={formData.mountain_name}
          onChange={handleChange}
        />
        <input
          type="file"
          name="mountain_photo"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Deskripsi"
          className="w-full border p-2 rounded"
          value={formData.description}
          onChange={handleChange}
        />
        <textarea
          name="equipment"
          placeholder="Peralatan"
          className="w-full border p-2 rounded"
          value={formData.equipment}
          onChange={handleChange}
        />
        <input
          type="text"
          name="estimation_time"
          placeholder="Estimasi Waktu (contoh: 2 malam)"
          className="w-full border p-2 rounded"
          value={formData.estimation_time}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Harga"
          className="w-full border p-2 rounded"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="time"
          name="traveling_time"
          className="w-full border p-2 rounded"
          value={formData.traveling_time}
          onChange={handleChange}
        />
        <textarea
          name="agenda"
          placeholder="Agenda"
          className="w-full border p-2 rounded"
          value={formData.agenda}
          onChange={handleChange}
        />
        <select
          name="id_guide"
          className="w-full border p-2 rounded"
          value={formData.id_guide}
          onChange={handleChange}
        >
          <option value="">Pilih Guide</option>
          {guides.map((guide) => (
            <option key={guide.id} value={guide.id}>
              {guide.name}
            </option>
          ))}
        </select>
        <div className="space-y-2">
          <label className="block font-semibold">Pilih Porter</label>
          {porters.map((porter) => (
            <div key={porter.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="porter_ids"
                value={porter.id}
                checked={formData.porter_ids.includes(porter.id)}
                onChange={handleChange}
              />
              <span>{porter.name}</span>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tambah Open Trip
        </button>
      </form>
    </div>
  );
};

export default AddOpenTrip;
