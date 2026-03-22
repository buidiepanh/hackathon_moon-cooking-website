import { Route, Routes } from "react-router";
import PublicPage from "../pages/user/publicPage";
import Header from "../components/header";
import Footer from "../components/footer";
import LoginPage from "../pages/auth/login/login";
import SignupPage from "../pages/auth/register/register";
import ReceiptDetail from "../pages/user/receiptDetail";
import ChefLayout from "../pages/chef/chef";
import AdminLayout from "../pages/admin/admin";

function UserRouter() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/receipt-detail/:receiptId" element={<ReceiptDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

function AdminRouter() {
  return (
    <>
      <Routes>
        <Route path="" element={<AdminLayout />} />
      </Routes>
    </>
  );
}

function ChefRouter() {
  return (
    <>
      <Routes>
        <Route path="" element={<ChefLayout />} />
      </Routes>
    </>
  );
}

export function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<UserRouter />} />
        <Route path="/chef" element={<ChefRouter />} />
        <Route path="/admin" element={<AdminRouter />} />
      </Routes>
    </>
  );
}
