import { useState } from "react";

export default function ImageCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      <img
        src={`http://localhost:5000${images[index]}`}
        alt="Donation"
        className="w-full h-48 object-cover rounded-lg border"
      />

      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
