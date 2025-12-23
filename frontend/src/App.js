import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Claim from "./pages/Claim";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/SIgnup";
import Login from "./pages/Login";
import Nearby from "./pages/Nearby";
import ChatPage from "./pages/ChatPage";
import MyDonations from "./pages/MyDonations"; // ✅ NEW IMPORT

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/claim" element={<Claim />} />
            <Route path="/chat/:donationId" element={<ChatPage />} />
            <Route path="/nearby" element={<Nearby />} />
            <Route path="/my-donations" element={<MyDonations />} /> {/* ✅ NEW */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
