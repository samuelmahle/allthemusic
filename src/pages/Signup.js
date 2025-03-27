import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('❌ Passwords do not match.');
    }

    try {
      setError('');
      await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('❌ This email is already in use.');
          break;
        case 'auth/invalid-email':
          setError('❌ Please enter a valid email.');
          break;
        case 'auth/weak-password':
          setError('❌ Password must be at least 6 characters.');
          break;
        default:
          setError('❌ Failed to create an account.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">📝 Sign Up</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" ref={emailRef} className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" ref={passwordRef} className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input type="password" ref={passwordConfirmRef} className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" required />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold">
            ✅ Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
