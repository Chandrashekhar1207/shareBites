export default function DonationDetailsModal({ donation, onClose }) {
  if (!donation) return null;

  const images = donation.images ? JSON.parse(donation.images) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-5 relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">{donation.title}</h2>
        <p className="text-gray-700 mb-3">{donation.message}</p>

        {/* Images */}
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000${img}`}
              className="w-32 h-32 object-cover rounded"
              alt=""
            />
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>📍 Latitude: {donation.latitude}</p>
          <p>📍 Longitude: {donation.longitude}</p>
          <p>⏰ Expires: {new Date(donation.expiryTime).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
