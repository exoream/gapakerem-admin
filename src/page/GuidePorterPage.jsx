import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios'; 
import Cookies from 'js-cookie'; 
import Pagination from '../components/Pagination';

const GuidePorter = () => {
  const [guides, setGuides] = useState([]); // State untuk menyimpan data guides
  const [porters, setPorters] = useState([]); // State untuk menyimpan data porters
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(''); // State untuk error
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [currentGuide, setCurrentGuide] = useState(null); // State untuk menyimpan guide yang sedang diedit
  const [currentPorter, setCurrentPorter] = useState(null); // State untuk menyimpan porter yang sedang diedit
  const [image, setImage] = useState(null); // State untuk menyimpan gambar yang diupload
  const [currentPageGuide, setCurrentPageGuide] = useState(1);
  const [currentPagePorter, setCurrentPagePorter] = useState(1);
  const itemsPerPage = 5;
  const displayedGuides = guides.slice((currentPageGuide - 1) * itemsPerPage, currentPageGuide * itemsPerPage);
  const displayedPorters = porters.slice((currentPagePorter - 1) * itemsPerPage, currentPagePorter * itemsPerPage);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading ke true saat memulai fetch
      try {
        const token = Cookies.get('token'); // Ambil token dari cookies
        if (!token) {
          throw new Error('Token not found');
        }

        const [guideResponse, porterResponse] = await Promise.all([
          axios.get('https://gapakerem.vercel.app/guides', {
            headers: {
              'Authorization': `Bearer ${token}`, // Kirim token dalam header
            },
          }),
          axios.get('https://gapakerem.vercel.app/porters', {
            headers: {
              'Authorization': `Bearer ${token}`, // Kirim token dalam header
            },
          }),
        ]);

        setGuides(guideResponse.data.data.guides || []);
        setPorters(porterResponse.data.data.porters || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message); // Tampilkan pesan error
      } finally {
        setLoading(false); // Set loading ke false setelah permintaan selesai
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
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  
  // Helper function untuk mengubah base64 ke File
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
            'Authorization': `Bearer ${Cookies.get('token')}`, // Kirim token dalam header
          },
        });
        setGuides((prevGuides) => prevGuides.filter((guide) => guide.id !== id)); 
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const handleDeletePorter = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus porter ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://gapakerem.vercel.app/porters/${id}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`, // Kirim token dalam header
          },
        });
        setPorters((prevPorters) => prevPorters.filter((porter) => porter.id !== id)); 
      } catch (err) {
        setError(err.response?.data?.message || err.message);
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

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <div className="flex">
      <div className="w-full p-8">
        <h1 className="text-2xl font-bold mb-8">Guide & Porter</h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Guide</h2>
            <button onClick={() => handleAddClick('guide')} className="bg-yellow-500 text-white p-2 rounded-full">
              <FaPlus />
            </button>
          </div>
          <table className="w-full bg-white border shadow-md rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Foto</th>
                <th className="p-4 text-left">Nama Guide</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {guides.length > 0 ? (
                displayedGuides.map((guide, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">
                      <img src={guide.photo || "https://placehold.co/50"} alt="Guide Photo" className="rounded-md h-20 w-20" />
                    </td>
                    <td className="p-4">{guide.name}</td>
                    <td className="p-4 flex space-x-2">
                      <button onClick={() => handleEditClick(guide)} className="bg-yellow-500 text-white p-2 rounded">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteGuide(guide.id)} className="bg-red-500 text-white p-2 rounded">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center">No guides available</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPageGuide}
            totalItems={guides.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPageGuide(page)}
          />
        </div>

        <hr className="my-8" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Porter</h2>
            <button onClick={() => handleAddClick('porter')} className="bg-yellow-500 text-white p-2 rounded-full">
              <FaPlus />
            </button>
          </div>
          <table className="w-full bg-white border shadow-md rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Foto</th>
                <th className="p-4 text-left">Nama Porter</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {porters.length > 0 ? (
                displayedPorters.map((porter, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">
                      <img src={porter.photo || "https://placehold.co/50"} alt="Porter Photo" className="rounded-md w-20 h-20" />
                    </td>
                    <td className="p-4">{porter.name}</td>
                    <td className="p-4 flex space-x-2">
                      <button onClick={() => handleEditPorterClick(porter)} className="bg-yellow-500 text-white p-2 rounded">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeletePorter(porter.id)} className="bg-red-500 text-white p-2 rounded">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center">No porters available</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Porter Pagination */}
          <Pagination
            currentPage={currentPagePorter}
            totalItems={porters.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPagePorter(page)}
          />
        </div>
      </div>

      {showEditPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center mb-8">
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
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="name">Nama</label>
                <input className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500" id="name" type="text" defaultValue={currentGuide ? currentGuide.name : currentPorter.name} autoComplete="off" />
              </div>
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="photo">Foto</label>
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
              <div className="mb-6">
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="flex justify-center">
                <button className="bg-orange-500 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600" type="submit">Edit</button>
              </div>
            </form>
            <button className="bg-red-500 text-white p-2 rounded mt-4" onClick={closePopup}>Close</button>
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
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="name">Nama</label>
                <input className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500" id="name" type="text" autoComplete="off" />
              </div>
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="photo">Foto</label>
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
              <div className="mb-6">
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="flex justify-center">
                <button className="bg-orange-500 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600" type="submit">Tambah</button>
              </div>
            </form>
            <button className="bg-red-500 text-white p-2 rounded mt-4" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidePorter;