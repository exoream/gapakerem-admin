import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../page/Dashboard";
import UserDash from "../page/userDash";
import OpenTrip from "../page/OpenTrip";
import PrivateTrip from "../page/PrivateTrip";
import TranOpenTrip from "../page/TransOpenTrip";
import TranPrivTrip from "../page/TransPrivTrip";
import Laporan from "../page/LaporanTrip";
import GuidePorter from "../page/GuidePorterPage";
import Login from "../page/Login";
import DetailOpenTransaksi from "../page/DetOpenTran";
import DetailPrivateTransaksi from "../page/DetPrivTrip";
import AddOpenTrip from "../page/AddOpenTrip";
import EditOpenTrip from "../page/EditOpenTrip";
import AddPrivTrip from "../page/AddPrivateTrip";
import UserDetailView from "../page/UserDetailView";
import ViewOpenTrip from "../page/ViewOpenTrip";
import ViewPrivateTrip from "../page/ViewPrivateTrip";

function AppRoutes() {
    const location = useLocation();
    const isLoginPage = location.pathname === "/";

    if (isLoginPage) {
        return (
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        );
    }

    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/user" element={<UserDash />} />
                        <Route path="/opentrip" element={<OpenTrip />} />
                        <Route path="/privtrip" element={<PrivateTrip />} />
                        <Route path="/booking-open" element={<TranOpenTrip />} />
                        <Route path="/booking-private" element={<TranPrivTrip />} />
                        <Route path="/laporan" element={<Laporan />} />
                        <Route path="/guideporter" element={<GuidePorter />} />
                        <Route path="/booking/open/:id" element={<DetailOpenTransaksi />} />
                        <Route path="/booking/private/:id" element={<DetailPrivateTransaksi />} />
                        <Route path="/add-open-trip" element={<AddOpenTrip />} />
                        <Route path="/edit-open-trip/:id" element={<EditOpenTrip />} />
                        <Route path="/add-private-trip" element={<AddPrivTrip />} />
                        <Route path="/view-private-trip/:id" element={<ViewPrivateTrip />} />
                        <Route path="/view-open-trip/:id" element={<ViewOpenTrip />} />
                        <Route path="/user/:id" element={<UserDetailView />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default AppRoutes;
