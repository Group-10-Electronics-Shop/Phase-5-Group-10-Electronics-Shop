import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SAMPLE_CART = [
  { id: 1, title: 'LCD Monitor', price: 65000, qty: 1 },
  { id: 2, title: 'H1 Gamepad', price: 11000, qty: 2 },
]

function formatMoney(n){
  const v = Number(n) || 0
  return 'Kshs ' + v.toLocaleString('en-KE')
}

export default function Cart(){
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      if (raw) setItems(JSON.parse(raw))
      else setItems(SAMPLE_CART)
    } catch {
      setItems(SAMPLE_CART)
    }
  }, [])

  useEffect(() => {
    // persist cart when items change
    try { localStorage.setItem('cart', JSON.stringify(items)) } catch {}
  }, [items])

  function updateQty(id, newQty){
    if (newQty < 1) return
    setItems(prev => prev.map(it => it.id === id ? {...it, qty: newQty} : it))
    setDirty(true)
  }

  function removeItem(id){
    setItems(prev => prev.filter(it => it.id !== id))
    setDirty(true)
  }

  function applyCoupon(e){
    e?.preventDefault()
    if (!couponCode) {
      setCoupon(null)
      return
    }
    const code = couponCode.trim().toUpperCase()
    if (code === 'SAVE10') setCoupon({ code:'SAVE10', description: '10% off' })
    else setCoupon({ code, description: 'Invalid coupon' })
  }

  function calculateTotals(){
    const subtotal = items.reduce((s,it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0)
    const discount = coupon?.code === 'SAVE10' ? Math.round(subtotal * 0.10) : 0
    const shipping = 0
    const total = subtotal - discount + shipping
    return { subtotal, discount, shipping, total }
  }

  function handleUpdateCart(){
   
    setDirty(false)
  }

  function handleCheckout(){
    
    navigate('/checkout')
  }

  const totals = calculateTotals()

  if (!items || items.length === 0) {
    return (
      <div className="min-h-[60vh] p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-3">Cart</h1>
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link to="/products" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Return To Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Cart</h1>
          <p className="text-sm text-gray-600">Review your items before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded border">
              <div className="hidden sm:grid grid-cols-6 gap-4 text-xs text-gray-500 border-b pb-2 mb-3">
                <div className="col-span-3">Product</div>
                <div className="text-right">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Subtotal</div>
              </div>

              <div className="space-y-4">
                {items.map(it => (
                  <div key={it.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
                    <div className="sm:col-span-3 flex items-center gap-3">
                      <div className="w-20 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">Image</div>
                      <div>
                        <div className="font-medium">{it.title}</div>
                        <div className="text-sm text-gray-500">Product details / category</div>
                      </div>
                    </div>

                    <div className="text-right sm:text-right w-24">{formatMoney(it.price)}</div>

                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => updateQty(it.id, Number(it.qty) - 1)} className="px-2 py-1 border rounded">-</button>
                      <input
                        className="w-14 text-center border rounded px-2 py-1"
                        value={it.qty}
                        onChange={e => {
                          const v = parseInt(e.target.value || '0', 10)
                          if (!isNaN(v)) updateQty(it.id, v)
                        }}
                      />
                      <button onClick={() => updateQty(it.id, Number(it.qty) + 1)} className="px-2 py-1 border rounded">+</button>
                    </div>

                    <div className="text-right w-28 font-medium">{formatMoney((it.price || 0) * (it.qty || 0))}</div>

                    <div className="w-full sm:w-auto flex justify-end">
                      <button onClick={() => removeItem(it.id)} className="text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex gap-3">
                  <Link to="/products" className="px-4 py-2 border rounded text-sm">Return To Shop</Link>
                  <button onClick={handleUpdateCart} className="px-4 py-2 bg-gray-800 text-white rounded text-sm" disabled={!dirty}>Update Cart</button>
                </div>

                <form onSubmit={applyCoupon} className="flex items-center gap-2">
                  <input placeholder="Coupon Code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                    className="px-3 py-2 border rounded" />
                  <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Apply Coupon</button>
                </form>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-3">Cart Total</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><strong>{formatMoney(totals.subtotal)}</strong></div>
                <div className="flex justify-between"><span>Shipping:</span><strong>{totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping)}</strong></div>
                {totals.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount:</span><strong>- {formatMoney(totals.discount)}</strong></div>}
                <div className="flex justify-between text-lg mt-3"><span>Total:</span><strong>{formatMoney(totals.total)}</strong></div>
              </div>

              <div className="mt-4">
                <button onClick={handleCheckout} className="w-full px-4 py-2 bg-blue-600 text-white rounded">Proceed to checkout</button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <h4 className="font-medium">Support</h4>
              <p className="mt-2">Account · My Account · Product · View Cart · CheckOut</p>
              <p className="mt-2">01 Parklands, 001122, Nairobi. · +254 721 001 002 · exclusive@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
