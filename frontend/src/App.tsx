import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ResumeUpload from "./pages/ResumeUpload";
import History from "./pages/History";
import JobMatch from "./pages/JobMatch";
import JobMatchHistory from "./pages/JobMatchHistory";
import CoverLetterHistory from "./pages/CoverLetterHistory";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import InterviewHistory from "./pages/InterviewHistory";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/upload-resume" element={<ResumeUpload />} />

          <Route path="/history" element={<History />} />

          <Route path="/job-match" element={<JobMatch />} />

          <Route path="/job-match-history" element={<JobMatchHistory />} />

          <Route
            path="/cover-letter-history"
            element={<CoverLetterHistory />}
          />
          <Route path="/interview-history" element={<InterviewHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
