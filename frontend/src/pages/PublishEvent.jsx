import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PublishEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    organizer: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Event published successfully!");
        setFormData({
          title: "",
          description: "",
          event_date: "",
          event_time: "",
          location: "",
          organizer: "",
        });
      } else {
        alert(data.message || "Failed to publish event.");
      }
    } catch (error) {
      console.error("Publish event error:", error);
      alert("Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 text-white">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 rounded-lg bg-white/20 px-4 py-2 hover:bg-white/30"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">
            Publish College Event
          </h1>
          <p className="mt-2 text-blue-100">
            Publish an event for students to view and register.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-lg"
        >
          <div>
            <label className="mb-2 block font-semibold">
              Event Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
              placeholder="Example: College Hackathon"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border p-3"
              placeholder="Describe the event..."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Event Date *
              </label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Event Time
              </label>
              <input
                type="time"
                name="event_time"
                value={formData.event_time}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Example: Seminar Hall"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Organizer
            </label>
            <input
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Example: CSE Department"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Event"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default PublishEvent;