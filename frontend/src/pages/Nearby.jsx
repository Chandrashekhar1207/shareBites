import { useEffect, useState } from "react";
import axios from "axios";

export default function Nearby() {
  const [donations, setDonations] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius] = useState(3000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lon);

        fetchNearby(lat, lon);
      },
      () => {
        alert("Enable location access to see nearby food");
        setLoading(false);
      }
    );
  }, []);

  const fetchNearby = async (lat, lon) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/donate/nearby?latitude=${lat}&longitude=${lon}&radius=${radius}`
      );

      setDonations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Fetching nearby food...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Food Available Near You</h2>

      <div className="space-y-6">
        {donations.map((item) => (
          <div 
            key={item.id}
            className="border rounded-xl shadow p-4 bg-white hover:shadow-lg transition"
          >
            {/* Food image */}
            {item.images && (
              <img
                src={`http://localhost:5000${JSON.parse(item.images)[0]}`}
                alt="Food"
                className="w-full h-52 object-cover rounded-lg"
              />
            )}

            <div className="mt-3">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-700">{item.message}</p>

              {/* Location */}
              <p className="mt-2 text-sm text-pink-600 flex items-center gap-1">
                📍 {item.latitude}, {item.longitude}
              </p>

              {/* Navigate Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Navigate in Maps
              </a>
            </div>
          </div>
        ))}
      </div>

      {donations.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No donations found near you.
        </p>
      )}
    </div>
  );
}
