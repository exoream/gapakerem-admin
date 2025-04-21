import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../components/Loading2";

const AddOpenTrip = () => {
  const [loadingUpload, setLoadingUpload] = useState(false);
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
      console.error("Error :", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const fetchPorters = async () => {
    try {
      const res = await axios.get("https://gapakerem.vercel.app/porters");
      setPorters(res.data.data.porters);
    } catch (error) {
      console.error("Error :", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
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
    setLoadingUpload(true);

    const token = Cookies.get("token");

    const formDataToSend = new FormData();
    formDataToSend.append("mountain_name", formData.mountain_name);
    formDataToSend.append("mountain_photo", formData.mountain_photo);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("equipment", formData.equipment);
    formDataToSend.append("estimation_time", formData.estimation_time);

    formDataToSend.append("price", Number(formData.price));
    formDataToSend.append("trip_type", "open");

    const openTripData = {
      traveling_time: formData.traveling_time,
      agenda: formData.agenda,
      id_guide: Number(formData.id_guide),
      porters: formData.porter_ids.map((id) => Number(id)),
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

      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });

      setTimeout(() => {
        navigate("/opentrip");
      }, 3000);
    } catch (error) {
      console.error("Error :", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div className="p-10 flex items-center justify-center">
      <div className="w-2/3 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Open Trip</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Nama Gunung</label>
            <input
              type="text"
              name="mountain_name"
              value={formData.mountain_name}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Foto Gunung</label>
            <input
              type="file"
              name="mountain_photo"
              onChange={handleChange}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Deskripsi</label>
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Peralatan</label>
            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Estimasi Waktu</label>
            <input
              type="text"
              name="estimation_time"
              value={formData.estimation_time}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Harga</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Waktu Travel</label>
            <input
              type="text"
              name="traveling_time"
              value={formData.traveling_time}
              onChange={handleChange}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Agenda</label>
            <textarea
              type="text"
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              rows={4}
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
            />
          </div>

          <div className="mt-10 grid grid-cols-3 items-center gap-4">
            <label className="font-medium">Guide</label>
            <select
              name="id_guide"
              className="col-span-2 border border-gray-300 text-gray-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC100] focus:border-transparent w-full p-3"
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
          </div>

          <div className="mt-10 grid grid-cols-3 items-center">
            <label className="font-medium">Porter</label>
            <div className="flex gap-4 justify-start items-center gap-5">
              {porters.map((porter) => (
                <div key={porter.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="porter_ids"
                    value={porter.id}
                    checked={formData.porter_ids.includes(porter.id)}
                    onChange={handleChange}
                  />
                  <span className="text-sm">{porter.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20">
            {loadingUpload ? (
              <Loading />
            ) : (
              <button
                type="submit"
                className="bg-[#FFC100] text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
              >
                Tambah
              </button>
            )}
          </div>
        </form>
      </div>

      <ToastContainer
        className="absolute top-5 right-5 z-0"
      />
    </div>
  );
};

export default AddOpenTrip;
