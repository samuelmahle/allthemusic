import React, { useRef, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Log In</h2>
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
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold">
            🚀 Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-300">
          Need an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
