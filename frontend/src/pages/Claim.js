import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DonationDetailsModal from "../components/DonationDetailsModal";

export default function Claim() {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // 📍 Location + Distance
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(3000);
  const [loading, setLoading] = useState(true);

  // 🔍 Search & Sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nearest"); // nearest | newest

  const navigate = useNavigate();

  // 📍 Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      () => {
        alert("Please enable location to find nearby food");
        setLoading(false);
      }
    );
  }, []);

  // 🌍 Fetch nearby donations
  const fetchDonations = async () => {
    if (!latitude || !longitude) return;

    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donate/nearby",
        {
          params: {
            latitude,
            longitude,
            radius,
          },
        }
      );
      setDonations(res.data);
    } catch (err) {
      console.error("Nearby fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [latitude, longitude, radius]);

  // 🟢 Claim food
  const handleClaim = async (donationId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to claim food");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/donate/claim", {
        donationId,
        claimantId: userId,
      });

      alert("Food claimed successfully!");

      setDonations((prev) =>
        prev.filter((d) => d.id !== donationId)
      );

      navigate(`/chat/${donationId}`);
    } catch (err) {
      console.error(err);
      alert("Error claiming food");
    }
  };

  // 🔍 SEARCH + SORT LOGIC
  const filteredDonations = useMemo(() => {
    let data = [...donations];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.message?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "nearest") {
      data.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "newest") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return data;
  }, [donations, search, sortBy]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Available Food Nearby
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 mb-4">
          Finding nearby food...
        </p>
      )}

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search food (rice, bread, veg...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-4 py-2 rounded md:w-48"
        >
          <option value="nearest">Nearest First</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* DISTANCE FILTER */}
      <div className="mb-6">
        <label className="block font-medium mb-1">
          Search Radius: {radius / 1000} km
        </label>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {!loading && filteredDonations.length === 0 && (
        <p className="text-gray-500">
          No matching food available nearby.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {filteredDonations.map((item) => {
          const images = item.images
            ? JSON.parse(item.images)
            : [];

          return (
            <div
              key={item.id}
              className="border rounded-xl shadow p-4 bg-white"
            >
              {images.length > 0 && (
                <img
                  src={`http://localhost:5000${images[0]}`}
                  alt="food"
                  className="h-48 w-full object-cover rounded"
                />
              )}

              <h3 className="text-lg font-semibold mt-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600">
                {item.message}
              </p>

              {item.distance && (
                <p className="text-sm text-green-600 mt-1">
                  📍 {item.distance.toFixed(2)} km away
                </p>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => setSelectedDonation(item)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  View Details
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  View in Map
                </a>

                <button
                  onClick={() => handleClaim(item.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Claim Food
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </div>
  );
}
