import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Claim from "./pages/Claim";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/SIgnup"; // ✅ new
import Login from "./pages/Login";   // ✅ new

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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} /> {/* ✅ signup route */}
            <Route path="/login" element={<Login />} />   {/* ✅ login route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
