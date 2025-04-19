import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import TemplatePDF from './TemplatePDF';
import Loading from '../components/Loading';

const PrintReport = () => {
    const [openTripData, setOpenTripData] = useState([]);
    const [privateTripData, setPrivateTripData] = useState([]);
    const [totalOpenTrip, setTotalOpenTrip] = useState(0);
    const [totalPrivateTrip, setTotalPrivateTrip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const printTriggered = useRef(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const month = queryParams.get('month') || '04';
    const year = queryParams.get('year') || '2025';

    useEffect(() => {
        const fetchData = async () => {
            if (!loading && openTripData.length > 0) return;

            setLoading(true);
            try {
                const token = Cookies.get('token');

                const response = await axios.get(
                    `https://gapakerem.vercel.app/dashboard/monthly-trip-statistics?month=${parseInt(
                        month,
                        10
                    )}&year=${year}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = response.data.data;
                setOpenTripData(data.open_trip.trips);
                setPrivateTripData(data.private_trip.trips);
                setTotalOpenTrip(data.open_trip.total_price);
                setTotalPrivateTrip(data.private_trip.total_price);
                setError('');

                if (!printTriggered.current) {
                    setTimeout(() => {
                        window.print();
                        printTriggered.current = true;
                    }, 500);
                }

            } catch (err) {
                console.error("Error Response:", err.response);
                setError(err.response?.data?.message || "Terjadi kesalahan");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month, year]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="print-container">
            <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
          
          /* Hide back button when printing */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div className="no-print m-4">
                <button
                    onClick={handlePrint}
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-white mb-4"
                >
                    Print PDF
                </button>
            </div>

            <TemplatePDF
                month={month}
                year={year}
                openTrip={openTripData}
                privateTrip={privateTripData}
                totalOpen={totalOpenTrip}
                totalPrivate={totalPrivateTrip}
            />
        </div>
    );
};

export default PrintReport;