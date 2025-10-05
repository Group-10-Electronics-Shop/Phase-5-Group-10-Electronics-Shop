import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const DEFAULT_PROFILE = {
  firstName: 'EMMAH',
  lastName: 'GICHERU',
  email: 'gicheruemmah@gmail.com',
  addressLine: ' 5236, Nairobi',
  phone: '+254 7110123456',
}

function SectionNav({ current, onChange }) {
  const items = [
    { key: 'profile', label: 'My Profile' },
    { key: 'address', label: 'Address Book' },
    { key: 'payments', label: 'My Payment Options' },
    { key: 'orders', label: 'My Orders' },
    { key: 'wishlist', label: 'My WishList' },
    { key: 'password', label: 'Password Changes' },
  ]
  return (
    <nav className="space-y-1">
      {items.map(it => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={
            'w-full text-left px-3 py-2 rounded ' +
            (current === it.key ? 'bg-blue-600 text-white' : 'hover:bg-gray-100')
          }
        >
          {it.label}
        </button>
      ))}
    </nav>
  )
}

export default function Account() {
  const [section, setSection] = useState('profile')
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [savedMsg, setSavedMsg] = useState('')
  const [orders] = useState([]) 
  const [wishlist] = useState([])

  // password change UI state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('es_profile')
      if (raw) setProfile(JSON.parse(raw))
    } catch {}
  }, [])

  function saveProfile(e) {
    e?.preventDefault()
    try {
      localStorage.setItem('es_profile', JSON.stringify(profile))
      setSavedMsg('Profile saved')
      setTimeout(() => setSavedMsg(''), 2500)
    } catch {
      setSavedMsg('Failed to save profile locally')
      setTimeout(() => setSavedMsg(''), 2500)
    }
  }

  function addAddress() {
   
    const cloned = { ...profile }
    cloned.addressLine = cloned.addressLine || ''
    setProfile(cloned)
    saveProfile()
  }

  function handlePasswordChange(e) {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields.')
      return
    }
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.')
      return
    }
    
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    alert('Password changed (demo). In production this would call your backend.')
  }

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-sm text-gray-600">Welcome! {profile.firstName} {profile.lastName}</p>
          </div>
          <div className="text-sm text-gray-500">
            <Link to="/" className="mr-3 text-blue-600">Home</Link>
            <span> / </span>
            <span className="ml-3">My Account</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* left nav */}
          <div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-3">Manage My Account</h3>
              <SectionNav current={section} onChange={setSection} />
            </div>

            <div className="mt-4 bg-white p-4 rounded border text-sm">
              <h4 className="font-medium">Support</h4>
              <p className="text-gray-600 mt-2">Account · My Account · Product · View Cart · CheckOut</p>
              <p className="mt-2 text-gray-600">00134 Nairobi</p>
              <p className="mt-1 text-gray-600">electronicsshop@gmail.com · +254 0710 123 456</p>
            </div>
          </div>

          {/* main content */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded border">
              {section === 'profile' && (
                <>
                  <h2 className="text-lg font-semibold mb-4">My Profile</h2>
                  <form onSubmit={saveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input className="w-full border px-3 py-2 rounded" value={profile.firstName}
                          onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input className="w-full border px-3 py-2 rounded" value={profile.lastName}
                          onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input className="w-full border px-3 py-2 rounded" value={profile.email}
                          onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input className="w-full border px-3 py-2 rounded" value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Address</label>
                      <input className="w-full border px-3 py-2 rounded" value={profile.addressLine}
                        onChange={e => setProfile(p => ({ ...p, addressLine: e.target.value }))} />
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Save Changes</button>
                      <button type="button" onClick={() => { setProfile(DEFAULT_PROFILE); saveProfile() }} className="px-4 py-2 border rounded">Reset</button>
                      {savedMsg && <span className="text-sm text-green-600 ml-3">{savedMsg}</span>}
                    </div>
                  </form>
                </>
              )}

              {section === 'address' && (
                <>
                  <h2 className="text-lg font-semibold mb-4">Address Book</h2>
                  <div className="mb-4 text-sm text-gray-600">Your saved addresses. (Demo store — edit & save profile to update.)</div>

                  <div className="mb-4 border rounded p-4">
                    <div className="font-medium">{profile.firstName} {profile.lastName}</div>
                    <div className="text-sm text-gray-600">{profile.addressLine}</div>
                    <div className="text-sm text-gray-600">{profile.phone} · {profile.email}</div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 border rounded text-sm" onClick={() => { navigator.clipboard?.writeText(profile.addressLine) }}>Copy</button>
                      <button className="px-3 py-1 border rounded text-sm" onClick={() => addAddress()}>Add another (demo)</button>
                    </div>
                  </div>
                </>
              )}

              {section === 'payments' && (
                <>
                  <h2 className="text-lg font-semibold mb-4">My Payment Options</h2>
                  <div className="mb-3 text-sm text-gray-600">No real cards stored in demo. You can add a masking note here.</div>

                  <div className="space-y-3">
                    <div className="border rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Mpesa</div>
                          <div className="text-sm text-gray-600">Mobile money (Kenya)</div>
                        </div>
                        <div><button className="px-3 py-1 border rounded text-sm">Use</button></div>
                      </div>
                    </div>

                    <div className="border rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Airtel Money</div>
                          <div className="text-sm text-gray-600">Mobile money (Airtel)</div>
                        </div>
                        <div><button className="px-3 py-1 border rounded text-sm">Use</button></div>
                      </div>
                    </div>

                    <div className="border rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Bank Transfer</div>
                          <div className="text-sm text-gray-600">Bank details on file (demo)</div>
                        </div>
                        <div><button className="px-3 py-1 border rounded text-sm">Use</button></div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section === 'orders' && (
                <>
                  <h2 className="text-lg font-semibold mb-4">My Orders</h2>
                  {orders.length === 0 ? (
                    <div className="text-sm text-gray-600">Nothing — you have no past orders in this demo.</div>
                  ) : (
                    <ul className="space-y-3">
                      {orders.map(o => (
                        <li key={o.id} className="border rounded p-3">
                          <div className="flex justify-between"><div>Order {o.id}</div><div>{o.total}</div></div>
                          <div className="text-sm text-gray-600">Status: {o.status}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {section === 'wishlist' && (
                <>
                  <h2 className="text-lg font-semibold mb-4">My WishList</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-sm text-gray-600">No saved wishlist items in this demo.</div>
                  ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {wishlist.map(w => (
                        <li key={w.id} className="border rounded p-3">{w.title}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {section === 'password' && (
                <>
                  <h2 className="text-lg font-semibold mb-4">Password Changes</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium">Current Passwod</label>
                      <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">New Passwod</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Confirm New Passwod</label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }}
                        className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}