import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../components/Loading2";
import Loading2 from "../components/Loading";

const EditOpenTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    mountain_name: "",
    mountain_photo: null,
    mountain_photo_preview: "",
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

  const fetchTripDetail = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`https://gapakerem.vercel.app/trips/${id}`);
      console.log("Trip Detail API Response:", res.data);

      const trip = res.data.data;

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
      console.error("Error :", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
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
    setLoadingUpload(true);

    const token = Cookies.get("token");
    const formDataToSend = new FormData();

    if (formData.mountain_name?.trim()) {
      formDataToSend.append("mountain_name", formData.mountain_name);
    }

    if (formData.mountain_photo) {
      formDataToSend.append("mountain_photo", formData.mountain_photo);
    }

    if (formData.description?.trim()) {
      formDataToSend.append("description", formData.description);
    }

    if (formData.equipment?.trim()) {
      formDataToSend.append("equipment", formData.equipment);
    }

    if (formData.estimation_time?.trim()) {
      formDataToSend.append("estimation_time", formData.estimation_time);
    }

    if (formData.price !== '' && !isNaN(formData.price)) {
      formDataToSend.append("price", Number(formData.price));
    }

    formDataToSend.append("trip_type", "open");

    const openTripData = {};
    if (String(formData.traveling_time).trim()) {
      openTripData.traveling_time = String(formData.traveling_time);
    }

    if (formData.agenda?.trim()) {
      openTripData.agenda = String(formData.agenda);
    }

    if (formData.id_guide !== '' && !isNaN(formData.id_guide)) {
      openTripData.id_guide = Number(formData.id_guide);
    }

    const porters = formData.porter_ids
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));
    if (porters.length > 0) {
      openTripData.porters = porters;
    }

    if (Object.keys(openTripData).length > 0) {
      formDataToSend.append("open_trip", JSON.stringify(openTripData));
    }

    try {
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

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

      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      navigate("/opentrip");
    } catch (error) {
      console.error("Error :", error.response);
      toast.error(error.response?.data?.message || "Terjadi kesalahan", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  if (loading) return <Loading2 />;

  return (
    <div className="p-10 flex items-center justify-center">
      <div className="w-2/3 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800">Edit Open Trip</h1>

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

          {formData.mountain_photo_preview && (
            <a href={formData.mountain_photo_preview} target="_blank" rel="noopener noreferrer">
              <img
                src={formData.mountain_photo_preview}
                alt="Preview Foto Gunung"
                className="w-40 mt-5 rounded-lg hover:opacity-80 transition"
              />
            </a>
          )}

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
              type="time"
              name="traveling_time"
              value={
                formData.traveling_time !== ""
                  ? `${String(formData.traveling_time).padStart(2, "0")}:00`
                  : ""
              }
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
          </div>

          <div className="mt-10 grid grid-cols-3 items-start">
            <label className="font-medium mt-1">Porter</label>
            <div className="col-span-2 grid grid-cols-3 gap-x-2 gap-y-2">
              {porters.map((porter) => (
                <label key={porter.id} className="flex px-4 py-2 border border-gray-300 items-center gap-2 rounded-full">
                  <input
                    type="checkbox"
                    name="porter_ids"
                    value={porter.id}
                    checked={formData.porter_ids.includes(porter.id)}
                    onChange={handleChange}
                    className="appearance-none w-5 aspect-square shrink-0 rounded-full border border-gray-400 checked:bg-yellow-500 checked:border-yellow-500"
                  />
                  <span className="text-sm">{porter.name}</span>
                </label>

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
                Update
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

export default EditOpenTrip;
