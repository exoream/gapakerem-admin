import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuidePorter = () => {
  const [guides, setGuides] = useState([]);
  const [porters, setPorters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [currentGuide, setCurrentGuide] = useState(null);
  const [currentPorter, setCurrentPorter] = useState(null);
  const [image, setImage] = useState(null);
  const [currentPageGuide, setCurrentPageGuide] = useState(1);
  const [currentPagePorter, setCurrentPagePorter] = useState(1);
  const itemsPerPage = 5;
  const displayedGuides = guides.slice((currentPageGuide - 1) * itemsPerPage, currentPageGuide * itemsPerPage);
  const displayedPorters = porters.slice((currentPagePorter - 1) * itemsPerPage, currentPagePorter * itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const [guideResponse, porterResponse] = await Promise.all([
          axios.get('https://gapakerem.vercel.app/guides', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          axios.get('https://gapakerem.vercel.app/porters', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        setGuides(guideResponse.data.data.guides || []);
        setPorters(porterResponse.data.data.porters || []);
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

    fetchData();
  }, []);

  const handleEditClick = (guide) => {
    setCurrentGuide(guide);
    setImage(guide.photo);
    setShowEditPopup(true);
  };

  const handleEditPorterClick = (porter) => {
    setCurrentPorter(porter);
    setImage(porter.photo);
    setShowEditPopup(true);
  };

  const handleAddClick = (type) => {
    if (type === 'guide') {
      setCurrentGuide({});
    } else if (type === 'porter') {
      setCurrentPorter({});
      setCurrentGuide(null);
    }
    setImage(null);
    setShowAddPopup(true);
  };

  const closePopup = () => {
    setShowEditPopup(false);
    setShowAddPopup(false);
    setCurrentGuide(null);
    setCurrentPorter(null);
    setImage(null);
  };

  const handleAddGuide = async (newGuide) => {
    try {
      const formData = new FormData();
      formData.append('name', newGuide.name);
      if (image) {
        const file = dataURLtoFile(image, 'photo.png');
        formData.append('photo', file);
      }

      const response = await axios.post('https://gapakerem.vercel.app/guides', formData, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setGuides((prevGuides) => [...prevGuides, response.data.data]);
      closePopup();
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleEditGuide = async (updatedGuide) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedGuide.name);
      if (image && image !== updatedGuide.photo) {
        const file = dataURLtoFile(image, 'photo.png');
        formData.append('photo', file);
      }

      const response = await axios.put(`https://gapakerem.vercel.app/guides/${updatedGuide.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setGuides((prevGuides) =>
        prevGuides.map((guide) => (guide.id === response.data.data.id ? response.data.data : guide))
      );
      closePopup();
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleAddPorter = async (newPorter) => {
    try {
      const formData = new FormData();
      formData.append('name', newPorter.name);
      if (image) {
        const file = dataURLtoFile(image, 'photo.png');
        formData.append('photo', file);
      }

      const response = await axios.post('https://gapakerem.vercel.app/porters', formData, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPorters((prevPorters) => [...prevPorters, response.data.data]);
      closePopup();
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleEditPorter = async (updatedPorter) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedPorter.name);
      if (image && image !== updatedPorter.photo) {
        const file = dataURLtoFile(image, 'photo.png');
        formData.append('photo', file);
      }

      const response = await axios.put(`https://gapakerem.vercel.app/porters/${updatedPorter.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPorters((prevPorters) =>
        prevPorters.map((porter) => (porter.id === response.data.data.id ? response.data.data : porter))
      );
      closePopup();
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };


  const handleDeleteGuide = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus guide ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://gapakerem.vercel.app/guides/${id}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });
        setGuides((prevGuides) => prevGuides.filter((guide) => guide.id !== id));
      } catch (error) {
        console.error("Error Response:", error.response);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  const handleDeletePorter = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus porter ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://gapakerem.vercel.app/porters/${id}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });
        setPorters((prevPorters) => prevPorters.filter((porter) => porter.id !== id));
      } catch (error) {
        console.error("Error Response:", error.response);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10">
      <div className="rounded-xl shadow-lg p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Guide</h1>
          <button
            className="bg-[#FFC100] text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
            onClick={() => handleAddClick('guide')}>
            <FaPlus />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">No</th>
                <th className="py-4 px-6 text-left font-semibold">Foto</th>
                <th className="py-4 px-6 text-left font-semibold">Nama Guide</th>
                <th className="py-4 px-6 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {guides.length > 0 ? (
                displayedGuides.map((guide, index) => (
                  <tr
                    key={guide.id}
                    className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-800">
                      <img src={guide.photo} alt="Guide Photo" className="rounded-md h-20 w-20" />
                    </td>
                    <td className="py-4 px-6 text-gray-800">{guide.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleEditClick(guide)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleDeleteGuide(guide.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Tidak guide tersedia</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPageGuide}
          totalItems={guides.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPageGuide(page)}
        />
      </div>

      <div className="rounded-xl shadow-lg p-10 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Porter</h1>
          <button
            className="bg-[#FFC100] text-white px-4 py-2 text-sm rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
            onClick={() => handleAddClick('porter')}
          >
            <FaPlus />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full bg-white border shadow-md rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">No</th>
                <th className="py-4 px-6 text-left font-semibold">Foto</th>
                <th className="py-4 px-6 text-left font-semibold">Nama Guide</th>
                <th className="py-4 px-6 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {porters.length > 0 ? (
                displayedPorters.map((porter, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-800">
                      <img src={porter.photo || "https://placehold.co/50"} alt="Porter Photo" className="rounded-md w-20 h-20" />
                    </td>
                    <td className="py-4 px-6 text-gray-800">{porter.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleEditPorterClick(porter)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all transform hover:scale-110"
                          onClick={() => handleDeletePorter(porter.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Tidak porter tersedia</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPagePorter}
          totalItems={porters.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPagePorter(page)}
        />
      </div>

      {showEditPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center mb-10">
              <h1 className="text-3xl font-bold text-black mr-2">Edit</h1>
              <h1 className="text-3xl font-bold text-yellow-500">{currentGuide ? 'Guide' : 'Porter'}</h1>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (currentGuide) {
                handleEditGuide({ id: currentGuide.id, name: e.target.name.value });
              } else if (currentPorter) {
                handleEditPorter({ id: currentPorter.id, name: e.target.name.value });
              }
            }}>
              <div className="mb-5">
                <label className="font-medium">Nama</label>
                <input
                  id="name"
                  type="text"
                  defaultValue={currentGuide ? currentGuide.name : currentPorter.name}
                  autoComplete="off"
                  className="mt-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none w-full p-3"
                />
              </div>

              <div className="mb-5">
                <label className="block font-medium mb-4" htmlFor="photo">Foto</label>
                <div className="flex items-center">
                  <div className="w-24 h-24 border rounded-lg flex items-center justify-center">
                    <img src={image || (currentGuide ? currentGuide.photo : currentPorter.photo)} alt="Current image" className="rounded-lg" />
                  </div>
                  <div className="ml-4 text-gray-500 text-sm">
                    <p>Format jpg, jpeg, png</p>
                    <p> Max 10mb</p>
                  </div>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 py-2 px-6 rounded-full"
              />

              <div className="mt-10 flex justify-center gap-5">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition" type="submit">Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={closePopup}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center mb-8">
              <h1 className="text-3xl font-bold text-black mr-2">Tambah</h1>
              <h1 className="text-3xl font-bold text-yellow-500">{currentGuide ? 'Guide' : 'Porter'}</h1>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (currentGuide) {
                handleAddGuide({ name: e.target.name.value });
              } else if (currentPorter) {
                handleAddPorter({ name: e.target.name.value });
              }
            }}>
              <div className="mb-5">
                <label className="font-medium" htmlFor="name">Nama</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="off"
                  className="mt-2 border border-gray-300 text-gray-900 text-sm rounded-full focus:outline-none w-full p-3"
                />
              </div>

              <div className="mb-5">
                <label className="block font-medium mb-4" htmlFor="photo">Foto</label>
                <div className="flex items-center">
                  <div className="w-24 h-24 border rounded-lg flex items-center justify-center">
                    <img src={image || "https://placehold.co/100"} alt="Placeholder image for uploading a photo" className="rounded-lg" />
                  </div>
                  <div className="ml-4 text-gray-500 text-sm">
                    <p>Format jpg, jpeg, png</p>
                    <p>Max 10mb</p>
                  </div>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 py-2 px-6 rounded-full"
              />

              <div className="mt-10 flex justify-center gap-5">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition" type="submit">Tambah</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={closePopup}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        className="absolute top-5 right-5"
      />
    </div>
  );
};

export default GuidePorter;