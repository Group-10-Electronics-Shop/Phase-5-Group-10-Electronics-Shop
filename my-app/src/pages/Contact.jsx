import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-sm text-gray-600">We're available 24/7. Get in touch!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded border">
            <h2 className="font-semibold mb-3">Call Us</h2>
            <p className="text-sm text-gray-600 mb-4">Phone: <strong>+254 7110123456</strong></p>
            
            <h3 className="font-semibold mb-2">Write To Us</h3>
            <p className="text-sm text-gray-600">electronicsshop@gmail.com</p>
            <p className="text-sm text-gray-600 mt-2">Address: 00134 Nairobi, Kenya</p>
          </div>

          <div className="bg-white p-6 rounded border">
            <h2 className="font-semibold mb-3">Send Message</h2>
            
            {submitted && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
                Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border px-3 py-2 rounded"
                required
              />
              
              <input
                type="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border px-3 py-2 rounded"
                required
              />
              
              <input
                type="tel"
                placeholder="Your Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border px-3 py-2 rounded"
                required
              />
              
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full border px-3 py-2 rounded"
                rows="5"
              />
              
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}