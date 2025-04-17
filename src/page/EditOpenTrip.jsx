import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const EditOpenTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    mountain_name: "",
    mountain_photo: null, // file baru
    mountain_photo_preview: "", // preview gambar lama
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

  useEffect(() => {
    fetchGuides();
    fetchPorters();
    fetchTripDetail();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await axios.get("https://gapakerem.vercel.app/guides");
      setGuides(res.data.data.guides);
    } catch (err) {
      console.error("Gagal ambil data guide:", err);
    }
  };

  const fetchPorters = async () => {
    try {
      const res = await axios.get("https://gapakerem.vercel.app/porters");
      setPorters(res.data.data.porters);
    } catch (err) {
      console.error("Gagal ambil data porter:", err);
    }
  };

  
  const fetchTripDetail = async () => {
    try {
      const res = await axios.get(`https://gapakerem.vercel.app/trips/${id}`);
      console.log("Trip Detail API Response:", res.data); // DEBUG
  
      const trip = res.data.data;
  
      if (trip.trip_type !== "open") {
        console.error("Trip ini bukan tipe open_trip!");
        return;
      }
  
      setFormData({
        mountain_name: trip.mountain_name || "",
        price: Number(trip.price) || "",
        description: trip.description || "",
        equipment: trip.equipment || "",
        estimation_time: trip.estimation_time || "",
        trip_type: "open",
        mountain_photo: null,
        mountain_photo_preview: trip.mountain_photo || "",
        traveling_time: trip.traveling_time || "",
        agenda: trip.agenda || "",
        id_guide: trip.guide?.id ? String(trip.guide.id) : "", 
        porter_ids: Array.isArray(trip.porters)
        ? trip.porters
            .map((p) => parseInt(p.id, 10))
            .filter((id) => !isNaN(id))
        : [],
      });
    } catch (error) {
      console.error("Gagal fetch trip detail:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
  
    if (name === "mountain_photo") {
      setFormData({ 
        ...formData, 
        mountain_photo: files[0],
        mountain_photo_preview: URL.createObjectURL(files[0]) 
      });
    } else if (name === "porter_ids") {
      const valueInt = parseInt(value);
      if (isNaN(valueInt)) return; 
    
      const selected = [...formData.porter_ids];
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
    }
      else if (name === "traveling_time") {
      const jam = parseInt(value.split(":")[0], 10);
      setFormData({ ...formData, traveling_time: jam });
    }
     else {
      setFormData({ ...formData, [name]: type === "number" ? parseInt(value) : value });
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const formDataToSend = new FormData();
    formDataToSend.append("mountain_name", formData.mountain_name);
    if (formData.mountain_photo) {
      formDataToSend.append("mountain_photo", formData.mountain_photo);
    }
  
    formDataToSend.append("description", formData.description);
    formDataToSend.append("equipment", formData.equipment);
    formDataToSend.append("estimation_time", formData.estimation_time);
    formDataToSend.append("price", Number(formData.price)); 
    formDataToSend.append("trip_type", "open");
  
    const openTripData = {
      traveling_time: String(formData.traveling_time),
      agenda: String(formData.agenda),
      id_guide: Number(formData.id_guide), 
      porters: formData.porter_ids
        .map((id) => Number(id))
        .filter((id) => !isNaN(id)), 

    };
    formDataToSend.append("open_trip", JSON.stringify(openTripData));
  
    try {
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1], typeof pair[1]);
      }
      console.log("FormData sebelum kirim:", {
        id_guide: formData.id_guide,
        porter_ids: formData.porter_ids,
        traveling_time: formData.traveling_time,
        agenda: formData.agenda,
      });
      
      const res = await axios.put(
        `https://gapakerem.vercel.app/trips/open/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("RESPONSE DETAIL TRIP:", res.data);
      alert("Trip berhasil diperbarui!");
      navigate("/opentrip");
    } catch (err) {
      console.error("Gagal update trip:", err.response?.data || err.message);
      alert("Gagal update trip: " + (err.response?.data?.message || "Unknown Error"));
      console.error("DETAIL ERROR:", err.response?.data?.message);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Open Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="mountain_name"
          placeholder="Nama Gunung"
          className="w-full border p-2 rounded"
          value={formData.mountain_name}
          onChange={handleChange}
        />
        {formData.mountain_photo_preview && (
          <img
            src={formData.mountain_photo_preview}
            alt="Preview Foto Gunung"
            className="w-40 h-40 object-cover mb-2 rounded"
          />
        )}
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
          value={
            formData.traveling_time !== ""
              ? `${String(formData.traveling_time).padStart(2, "0")}:00`
              : ""
          }
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
          value={formData.id_guide || ""} 
          onChange={handleChange}
        >
          <option value="">Pilih Guide</option>
          {guides.map((guide) => (
            <option key={guide.id} value={String(guide.id)}>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditOpenTrip;
