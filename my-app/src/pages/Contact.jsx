
import React, { useState, useEffect } from 'react'

const DEFAULT_SUPPORT = {
  phone: '+254 7110123456',
  emails: ['electronicsshop@gmail.com'],
  secondaryEmails: ['customer@exclusive.com','support@exclusive.com'],
  address: '11 Parklands, 001122, Nairobi',
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(null)
  const [support, setSupport] = useState(DEFAULT_SUPPORT)

  useEffect(() => {
    
    try {
      const raw = localStorage.getItem('es_support')
      if (raw) setSupport(JSON.parse(raw))
    } catch {}
  }, [])

  function validate() {
    if (!name.trim()) return 'Please provide your name.'
    if (!email.trim() || !/.+@.+\..+/.test(email)) return 'Please provide a valid email.'
    if (!phone.trim()) return 'Please provide a phone number.'
    if (!message.trim()) return 'Please write a message.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) {
      alert(err)
      return
    }
    setSaving(true)
    
    await new Promise(r => setTimeout(r, 450))
    const payload = {
      id: 'MSG-' + Date.now(),
      name, email, phone, message, createdAt: new Date().toISOString()
    }
    try {
      const raw = localStorage.getItem('contact_messages') || '[]'
      const arr = JSON.parse(raw)
      arr.unshift(payload)
      localStorage.setItem('contact_messages', JSON.stringify(arr))
    } catch (err) {
      // ignore
    }
    setSaving(false)
    setSent(payload)
    setName(''); setEmail(''); setPhone(''); setMessage('')
  }

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Contact</h1>
          <p className="text-sm text-gray-600">We are available 24/7, 7 days a week. Fill out the form and we'll get back to you within 24 hours.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded border">
            <h2 className="font-semibold mb-3">Call Us</h2>
            <p className="text-sm text-gray-600 mb-4">Phone: <strong>{support.phone}</strong></p>

            <h3 className="font-semibold mb-2">Write To Us</h3>
            <p className="text-sm text-gray-600 mb-4">Emails: {support.emails.join(', ')}</p>

            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">Secondary emails</div>
              <ul className="text-sm text-gray-600 list-disc ml-5">
                {support.secondaryEmails.map((e,i) => <li key={i}>{e}</li>)}
              </ul>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <div>Address: {support.address}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded border">
            <h2 className="font-semibold mb-3">Send Message</h2>

            {sent && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
                Message sent — thank you! (Ref: {sent.id})
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Your Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium">Your Email *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium">Your Phone *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="+2547xxxxxxx" />
              </div>

              <div>
                <label className="block text-sm font-medium">Your Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border px-3 py-2 rounded" rows="5" />
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
                  {saving ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" onClick={() => { setName(''); setEmail(''); setPhone(''); setMessage('') }} className="px-3 py-2 border rounded">Clear</button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Support · Account · Quick Link</p>
          <p className="mt-2">electronicsshop@gmail.com · +254 7110123456 · 00134 Nairobi</p>
          <p className="mt-1">© 2025 Electronics Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
