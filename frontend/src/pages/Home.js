import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div>
      <section className="bg-green-100 text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Reducing Food Waste: A Global Cause</h1>
        <p className="mb-6">Donate surplus food and help those in need</p>
        <Link to="/donate" className="bg-green-600 text-white px-6 py-2 rounded">
          Donate Now
        </Link>
      </section>
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 border rounded shadow">
            <h3 className="font-bold mb-2">Donate Food</h3>
            <p>Share surplus food with people in need.</p>
          </div>
          <div className="p-6 border rounded shadow">
            <h3 className="font-bold mb-2">Claim Food</h3>
            <p>Collect available food donations nearby.</p>
          </div>
          <div className="p-6 border rounded shadow">
            <h3 className="font-bold mb-2">Volunteer</h3>
            <p>Join us in distributing food to communities.</p>
          </div>
        </div>
      </section>
      <section className="bg-green-50 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p>To fight hunger and reduce food waste by connecting donors with communities in need.</p>
      </section>
    </div>
  );
}