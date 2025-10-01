import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

function AccountPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto card p-6 text-center">
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <button
        onClick={() => dispatch(logoutUser())}
        className="btn mt-4"
      >
        Logout
      </button>
    </div>
  );
}

export default AccountPage;
