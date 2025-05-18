import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./loggedOut/LandingPage";
import Login from "./loggedOut/Login";
import SignUp from "./loggedOut/Signup";
import ForgotPassword from "./loggedOut/ForgotPassword";
import ResetPassword from "./loggedOut/ResetPassword";
import Home from "./loggedIn/Home";
import AHome from "./admin/Home";
import AUserList from "./admin/UserList";
import ACertificates from "./admin/CertificatesList";
import AReports from "./admin/ReportsList";
import TemplateSelector from "./loggedIn/TemplateSelector";
import CreateCertificate from "./loggedIn/CreateCertificate";
import CertificateDisplay from "./loggedIn/CertificateDIsplay";
import ReviewCertificate from "./loggedIn/ReviewCertificate";
import AllCerts from "./loggedIn/AllCerts";
import AllReports from "./loggedIn/AllReports";
import ProfilePage from "./admin/Profile";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/templates" element={<TemplateSelector />} />
        <Route path="/createCertificate" element={<CreateCertificate />} />
        <Route path="/certificates/:pdfPath" element={<CertificateDisplay />} />
        <Route
          path="/review-certificate/:certificateId"
          element={<ReviewCertificate />}
        />
        <Route path="/certificates" element={<AllCerts />} />
        <Route path="/reports" element={<AllReports />} />
        <Route path="/admin">
          {/* Nested Route for /admin/teacher */}
          <Route path="home" element={<AHome />} />
          <Route path="users" element={<AUserList />} />
          <Route path="certificates" element={<ACertificates />} />
          <Route path="reports" element={<AReports />} />
          <Route path="profile/:id" element={<ProfilePage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
