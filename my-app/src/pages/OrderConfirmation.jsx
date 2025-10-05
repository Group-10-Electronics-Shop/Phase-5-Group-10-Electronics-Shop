import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function formatMoney(n){
  const v = Number(n) || 0
  return 'Kshs ' + v.toLocaleString('en-KE')
}

function paymentLabel(k){
  switch(k){
    case 'bank': return 'Bank'
    case 'mpesa': return 'Mpesa'
    case 'airtel': return 'Airtel Money'
    case 'cod': return 'Cash on delivery'
    default: return k
  }
}

export default function OrderConfirmation(){
  const [order, setOrder] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('last_order')
      if (raw) setOrder(JSON.parse(raw))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to read last_order', err)
    }
  }, [])

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">No recent order found</h1>
        <p className="mt-2">You can place an order on <Link to="/checkout" className="text-blue-600">Checkout</Link>.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Order Confirmation</h1>
      <p className="text-sm text-gray-600 mb-4">Order ID: <strong>{order.id}</strong></p>

      <div className="mb-4">
        <h3 className="font-semibold">Billing</h3>
        <div>{order.name} {order.company ? `• ${order.company}` : ''}</div>
        <div>{order.address}</div>
        {order.apartment && <div>{order.apartment}</div>}
        <div>{order.city}</div>
        <div>{order.phone}</div>
        <div>{order.email}</div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Items</h3>
        <ul className="divide-y">
          {order.items.map(it => (
            <li key={it.id} className="py-2 flex justify-between">
              <span>{it.title}</span><span>{formatMoney(it.price)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <div className="flex justify-between"><span>Subtotal</span><strong>{formatMoney(order.totals.subtotal)}</strong></div>
        <div className="flex justify-between"><span>Discount</span><strong>-{formatMoney(order.totals.discount)}</strong></div>
        <div className="flex justify-between"><span>Shipping</span><strong>{order.totals.shipping === 0 ? 'Free' : formatMoney(order.totals.shipping)}</strong></div>
        <div className="flex justify-between text-lg mt-3"><span>Total</span><strong>{formatMoney(order.totals.total)}</strong></div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Payment</h3>
        <div>Method: <strong>{paymentLabel(order.payment)}</strong></div>
        {order.mobileMoneyNumber && <div>Mobile number: <strong>{order.mobileMoneyNumber}</strong></div>}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Contact: electronicsshop@gmail.com · +254 7110123456 · 00134 Nairobi</p>
      </div>

      <div className="flex gap-3 mt-6">
        <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Home</Link>
        <Link to="/products" className="px-4 py-2 bg-blue-600 text-white rounded">Continue shopping</Link>
      </div>
    </div>
  )
}