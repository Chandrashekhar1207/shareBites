import { useEffect, useState } from "react";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";

export default function Nearby() {
  const [donations, setDonations] = useState([]);
  const [radius, setRadius] = useState(3000);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      () => alert("Enable location access to see nearby food")
    );
  }, []);

  // Fetch whenever filters change
  useEffect(() => {
    if (!coords) return;
    fetchNearby();
  }, [coords, radius, search]);

  const fetchNearby = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/donate/nearby",
        {
          params: {
            latitude: coords.lat,
            longitude: coords.lon,
            radius,
            search
          }
        }
      );
      setDonations(res.data);
    } catch (err) {
      console.error("Failed to fetch nearby donations", err);
      alert("Failed to load nearby food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Nearby Food</h2>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <div className="w-full md:w-60">
          <label className="block text-sm font-medium">
            Radius: {radius / 1000} km
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
      </div>

      {loading && <p className="text-center">Loading nearby food...</p>}

      {!loading && donations.length === 0 && (
        <p className="text-center text-gray-500">
          No food available nearby 😔
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {donations.map(item => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow bg-white"
          >
            <ImageCarousel
              images={JSON.parse(item.images || "[]")}
            />

            <h3 className="text-lg font-semibold mt-2">
              {item.title}
            </h3>

            <p className="text-sm text-gray-600">
              {item.message}
            </p>

            <p className="text-sm mt-1">
              📍 {item.distance.toFixed(2)} km away
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
