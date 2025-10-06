import React from 'react';

const Stat = ({label, value}) => (
  <div className="flex-1 text-center">
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

const PersonCard = ({name, title}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-600 mb-3">
      👤
    </div>
    <div className="font-medium">{name}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

export default function About() {
  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">Our Story</h1>
          <p className="text-sm text-gray-600 mt-1">
            We're an electronics marketplace built for people who value quality and service.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat label="Sellers active" value="10.5K" />
          <Stat label="Monthly Sales" value="4.5M" />
          <Stat label="Active Customers" value="45.5K" />
          <Stat label="Annual Revenue" value="58M" />
        </section>

        <section className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed">
            We focus on creating a dependable, user-friendly electronics store where product quality and customer experience come first.
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
      </div>
    </div>
  );
}