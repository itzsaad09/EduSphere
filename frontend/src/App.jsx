import React from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutUs from './pages/AboutUs.jsx'
import FeedbackSubmission from './components/FeedbackSubmission.jsx'
import Footer from './components/Footer.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsofServices from './components/TermsofServices.jsx'
import NotFound from './components/404.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import OTPVerification from './components/OTPVerification.jsx'
import ChangePassword from './components/ChangePassword.jsx'
import ContactUs from './components/ContactUs.jsx'
import MyProfile from './components/MyProfile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ExploreCourses from './pages/ExploreCourses.jsx'
import CoursePlayer from './components/CoursePlayer.jsx'
import Certificate2 from './components/Certificate.jsx'
import CertificateDataFetcher from './components/CertificateDataFetcher.jsx'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/feedback" element={<FeedbackSubmission />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsofServices />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<ExploreCourses />} />
        <Route path="/courses/:id" element={<CoursePlayer />} />
        <Route path="/certificate" element={<CertificateDataFetcher />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
