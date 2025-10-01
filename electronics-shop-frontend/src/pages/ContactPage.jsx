import React from 'react';

function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4 text-gray-700">
        Have questions or need support? Reach us through the form below:
      </p>
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="input" required />
        <input type="email" placeholder="Your Email" className="input" required />
        <textarea placeholder="Your Message" className="input" required />
        <button type="submit" className="btn">Send Message</button>
      </form>
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Email:</strong> support@electronicskenya.co.ke</p>
        <p><strong>Phone:</strong> +254 700 123 456</p>
        <p><strong>Address:</strong> Nairobi CBD, Kenyatta Avenue, Kenya</p>
      </div>
    </div>
  );
}

export default ContactPage;
