import React from 'react'

const Stat = ({label, value}) => (
  <div className="flex-1 text-center">
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
)

const PersonCard = ({name, title}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-600 mb-3">👤</div>
    <div className="font-medium">{name}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
)

export default function About(){
  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">Our Story</h1>
          <p className="text-sm text-gray-600 mt-1">
            We’re an electronics marketplace built for people who value beautiful design and fast, reliable service.
            From hand-picked gadgets to clear, secure checkout and speedy delivery, we make shopping simple and trustworthy.
            Enjoy helpful support, transparent pricing, and an easy shopping experience from browsing to delivery.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat label="Sellers active on our site" value="10.5K" />
          <Stat label="Monthly Product Sale" value="4,500,000M" />
          <Stat label="Customers active on our site" value="45.5K" />
          <Stat label="Annual gross sale on our site" value="58,000,000M" />
        </section>

        <section className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed">
            We focus on creating a dependable, user-friendly electronics store where product quality and customer experience come first.
            Our site is designed to help you find the right gadgets quickly, check out securely, and receive them fast.
            Count on clear totals, multiple payment options, and responsive support whenever you need it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <PersonCard name="Dennis" title="Founder & Chairman" />
            <PersonCard name="Emma" title="Managing Director" />
            <PersonCard name="Michael" title="Product Designer" />
            <PersonCard name="Brian" title="Co-Founder" />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border text-center">
            <h3 className="font-semibold mb-2">FREE AND FAST DELIVERY</h3>
            <p className="text-sm text-gray-600">Free delivery for all orders over Kshs 14,000</p>
          </div>

          <div className="bg-white p-4 rounded border text-center">
            <h3 className="font-semibold mb-2">24/7 CUSTOMER SERVICE</h3>
            <p className="text-sm text-gray-600">Friendly 24/7 customer support</p>
          </div>

          <div className="bg-white p-4 rounded border text-center">
            <h3 className="font-semibold mb-2">MONEY BACK GUARANTEE</h3>
            <p className="text-sm text-gray-600">We return money within 30 days</p>
          </div>
        </section>

        <footer className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">Support</h4>
          <p className="text-sm text-gray-600">Account · My Account · Product · View Cart · CheckOut</p>
          <p className="text-sm text-gray-600 mt-2">electronicsshop@gmail.com · +254 7110123456 · 00134 Nairobi</p>
          <p className="text-xs text-gray-400 mt-3">© 2025 Electronics Shop. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}