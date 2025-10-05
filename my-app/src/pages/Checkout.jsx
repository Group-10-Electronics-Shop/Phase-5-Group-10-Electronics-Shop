import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SAMPLE_ITEMS = [
  { id: 1, title: 'LCD Monitor', price: 65000 },
  { id: 2, title: 'H1 Gamepad', price: 11000 },
]

function formatMoney(n) {
  const v = Number(n) || 0
  return 'Kshs ' + v.toLocaleString('en-KE')
}

function OrderSummary({ items, coupon }) {
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0), 0)
  const discount = coupon?.code === 'SAVE10' ? Math.round(subtotal * 0.10) : 0
  const shipping = 0
  const total = subtotal - discount + shipping

  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">Your Order</h3>

      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="flex justify-between text-sm">
            <div>{i.title}</div>
            <div className="font-medium">{formatMoney(i.price)}</div>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      <div className="text-sm space-y-2">
        <div className="flex justify-between"><span>Subtotal:</span><strong>{formatMoney(subtotal)}</strong></div>
        <div className="flex justify-between"><span>Shipping:</span><strong>{shipping === 0 ? 'Free' : formatMoney(shipping)}</strong></div>
        {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount:</span><strong>- {formatMoney(discount)}</strong></div>}
        <div className="flex justify-between text-lg mt-3"><span>Total:</span><strong>{formatMoney(total)}</strong></div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const [firstName, setFirstName] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('')
  const [email, setEmail] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [payment, setPayment] = useState('bank') 
  const [saveInfo, setSaveInfo] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)

  const items = SAMPLE_ITEMS

  useEffect(() => {
    
    if (!mobileMoneyNumber || mobileMoneyNumber === phone) {
      setMobileMoneyNumber(phone)
    }
  
  }, [phone])

  function applyCoupon(e) {
    e.preventDefault()
    if (!couponCode) {
      setCoupon(null)
      return
    }
    const code = couponCode.trim().toUpperCase()
    if (code === 'SAVE10') {
      setCoupon({ code: 'SAVE10', description: '10% off' })
    } else {
      setCoupon({ code, description: 'Invalid coupon' })
    }
  }

  function validateForm() {
    if (!firstName.trim()) return 'Please enter First Name*'
    if (!address.trim()) return 'Please enter Street Address*'
    if (!city.trim()) return 'Please enter Town/City*'
    if (!phone.trim()) return 'Please enter Phone Number*'
    if (!email.trim() || !/.+@.+\..+/.test(email)) return 'Please enter a valid Email Address*'
    if ((payment === 'mpesa' || payment === 'airtel') && (!mobileMoneyNumber || !/^\+?\d{7,15}$/.test(mobileMoneyNumber))) {
      return 'Please enter a valid mobile money number (e.g. +2547...)'
    }
    return null
  }

  async function placeOrder(e) {
    e.preventDefault()
    setOrderPlaced(null)
    const err = validateForm()
    if (err) {
      window.alert(err)
      return
    }
    setPlacing(true)
    await new Promise(r => setTimeout(r, 600))

    const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0), 0)
    const discount = coupon?.code === 'SAVE10' ? Math.round(subtotal * 0.10) : 0
    const shipping = 0
    const total = subtotal - discount + shipping

    const order = {
      id: 'ORD-' + Date.now(),
      name: firstName,
      company,
      address,
      apartment,
      city,
      phone,
      mobileMoneyNumber: (payment === 'mpesa' || payment === 'airtel') ? mobileMoneyNumber : null,
      payment, 
      items,
      coupon: coupon?.code || null,
      totals: { subtotal, discount, shipping, total },
      savedInfo: !!saveInfo,
      createdAt: new Date().toISOString(),
    }

    try { localStorage.setItem('last_order', JSON.stringify(order)) } catch {}

    setPlacing(false)
    setOrderPlaced(order)
  }

  function paymentLabel(key) {
    switch (key) {
      case 'bank': return 'Bank'
      case 'mpesa': return 'Mpesa'
      case 'airtel': return 'Airtel Money'
      case 'cod': return 'Cash on delivery'
      default: return key
    }
  }

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">CheckOut</h1>
          <p className="text-sm text-gray-600">Billing Details — review & place your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Billing Details</h2>

              <form onSubmit={placeOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">First Name*</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="w-full border px-3 py-2 rounded" placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Company Name</label>
                    <input value={company} onChange={e => setCompany(e.target.value)}
                      className="w-full border px-3 py-2 rounded" placeholder="Company (optional)" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Street Address*</label>
                  <input value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full border px-3 py-2 rounded" placeholder="House number and street name" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Apartment, floor, etc. (optional)</label>
                  <input value={apartment} onChange={e => setApartment(e.target.value)}
                    className="w-full border px-3 py-2 rounded" placeholder="Apt, suite, unit" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Town/City*</label>
                    <input value={city} onChange={e => setCity(e.target.value)}
                      className="w-full border px-3 py-2 rounded" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone Number*</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full border px-3 py-2 rounded" placeholder="+254 7xx xxx xxx" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Email Address*</label>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded" placeholder="you@example.com" />
                </div>

                <div className="flex items-center gap-3">
                  <input id="saveInfo" type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} />
                  <label htmlFor="saveInfo" className="text-sm">Save this information for faster check-out next time</label>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="payment" value="bank" checked={payment === 'bank'} onChange={() => setPayment('bank')} />
                      <span>Bank</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input type="radio" name="payment" value="mpesa" checked={payment === 'mpesa'} onChange={() => setPayment('mpesa')} />
                      <span>Mpesa</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input type="radio" name="payment" value="airtel" checked={payment === 'airtel'} onChange={() => setPayment('airtel')} />
                      <span>Airtel Money</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                      <span>Cash on delivery</span>
                    </label>
                  </div>
                </div>

                {(payment === 'mpesa' || payment === 'airtel') && (
                  <div>
                    <label className="block text-sm font-medium">Mobile money number (for {payment === 'mpesa' ? 'Mpesa' : 'Airtel Money'})</label>
                    <input value={mobileMoneyNumber} onChange={e => setMobileMoneyNumber(e.target.value)}
                      className="w-full border px-3 py-2 rounded" placeholder="+2547xxxxxxxx" />
                    <p className="text-xs text-gray-500 mt-1">We will use this number to process the mobile money payment.</p>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button type="submit" disabled={placing}
                    className="px-4 py-2 bg-blue-600 text-white rounded">
                    {placing ? 'Placing order...' : 'Place Order'}
                  </button>

                  <Link to="/cart" className="inline-block px-3 py-2 border rounded text-sm">View Cart</Link>
                </div>
              </form>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <h4 className="font-medium">Support</h4>
              <p>Account · My Account · Product · View Cart · CheckOut</p>
              <p className="mt-2">electronicsshop@gmail.com · +254 7110123456 · 00134 Nairobi</p>
            </div>
          </div>

          <div>
            <div className="sticky top-6 space-y-4">
              <div className="bg-white p-4 rounded shadow-sm border">
                <form onSubmit={applyCoupon} className="flex gap-2 mb-3">
                  <input className="flex-1 border px-3 py-2 rounded" placeholder="Coupon Code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                  <button className="px-3 py-2 bg-gray-800 text-white rounded">Apply Coupon</button>
                </form>

                <OrderSummary items={items} coupon={coupon} />
              </div>

              <div className="bg-white p-4 rounded shadow-sm border">
                <h3 className="font-semibold mb-2">Payment</h3>
                <div className="text-sm">
                  <div className="mb-2">Selected: <strong>{paymentLabel(payment)}</strong></div>
                  {(payment === 'mpesa' || payment === 'airtel') && <div className="mb-2">Mobile number: <strong>{mobileMoneyNumber}</strong></div>}
                  <div>Available methods: Bank transfer, Mpesa, Airtel Money, Cash on delivery</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow-sm border text-sm">
                <h4 className="font-semibold mb-2">Notes</h4>
                <p>Free delivery for orders over Kshs 14,000 · Money back guarantee within 30 days.</p>
              </div>
            </div>
          </div>
        </div>

        {orderPlaced && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold">Order placed — {orderPlaced.id}</h3>
            <p>Thank you, {orderPlaced.name}. Your order total is <strong>{formatMoney(orderPlaced.totals.total)}</strong>.</p>
            {orderPlaced.mobileMoneyNumber && <p className="text-sm">Mobile money number used: <strong>{orderPlaced.mobileMoneyNumber}</strong></p>}
            <p className="text-xs text-gray-600 mt-2">We saved your order locally for demo. View it at <code>localStorage.last_order</code>.</p>
          </div>
        )}
      </div>
    </div>
  )
}