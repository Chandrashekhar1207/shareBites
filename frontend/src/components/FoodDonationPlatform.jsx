import React, { useState } from 'react';
import { Heart, MapPin, Clock, Users, Plus, Search, Filter, Bell, User, LogOut, Menu, X, Star, Package } from 'lucide-react';

// Mock data
const mockDonations = [
  {
    id: 1,
    donor: "Sunny Side Restaurant",
    foodType: "Fresh Vegetables & Fruits",
    quantity: "50 kg",
    location: "Downtown, City Center",
    description: "Fresh vegetables and fruits from today's preparation. Perfect condition.",
    timePosted: "2 hours ago",
    expiryTime: "6 hours",
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&h=200&fit=crop",
    status: "available",
    donorRating: 4.8,
    urgency: "medium"
  }
];

const FoodDonationPlatform = () => {
  const [currentUser, setCurrentUser] = useState({ name: "John Doe", organization: "Sunny Side Restaurant" });
  const [donations, setDonations] = useState(mockDonations);

  // Mock submit handler for donations
  const handleDonateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDonation = {
      id: donations.length + 1,
      donor: currentUser.organization || currentUser.name,
      foodType: formData.get('foodType'),
      quantity: formData.get('quantity'),
      location: formData.get('location'),
      description: formData.get('description'),
      timePosted: 'Just now',
      expiryTime: formData.get('expiryTime') || '2 hours',
      image: 'https://via.placeholder.com/300x200',
      status: 'available',
      donorRating: 5,
      urgency: formData.get('urgent') ? 'high' : 'medium'
    };
    setDonations([newDonation, ...donations]);
    e.target.reset();
    alert('Donation posted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6">Donate Food</h2>
      <form onSubmit={handleDonateSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
          <select name="foodType" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
            <option>Cooked Meals</option>
            <option>Fresh Vegetables & Fruits</option>
            <option>Bread & Pastries</option>
            <option>Packaged Food</option>
            <option>Beverages</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input name="quantity" type="text" placeholder="e.g., 50 kg" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input name="location" type="text" placeholder="Enter pickup address" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="3" placeholder="Describe the food" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Time</label>
          <input name="expiryTime" type="datetime-local" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>

        <div className="flex items-center space-x-2">
          <input name="urgent" type="checkbox" id="urgent" className="rounded" />
          <label htmlFor="urgent" className="text-sm text-gray-700">Mark as urgent (expires within 2 hours)</label>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <Plus className="w-5 h-5 mr-2" />
          Post Donation
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-12 mb-6">Browse Donations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {donations.map((donation) => (
          <div key={donation.id} className="bg-white rounded-xl shadow p-4">
            <img src={donation.image} alt={donation.foodType} className="w-full h-40 object-cover rounded mb-4" />
            <h3 className="font-semibold text-lg">{donation.foodType}</h3>
            <p>{donation.quantity} • {donation.location}</p>
            <p className="text-sm text-gray-600">{donation.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodDonationPlatform;
