"use client";
import React, { useState, useEffect } from 'react';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl); // Set token from URL if present
    } else {
      setError('Invalid verification link.'); // Error if token is missing
    }
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value); // Update OTP state on input change
    console.log('OTP Value:', e.target.value); // Debugging statement to check input value
  };

  const handleVerify = async () => {
    setError('');
    setMessage('');
    setLoading(true); 

    try {
    
      const response = await fetch('http://localhost:3000/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed.');
      }

      setMessage(result.message); // Success feedback if verification succeeds
    } catch (err) {
      // Type assertion to handle errors properly
      if (err instanceof Error) {
        setError(err.message); // Display error message
      } else {
        setError('An unknown error occurred.'); // Fallback for unknown errors
      }
    } finally {
      setLoading(false); // Stop loading spinner after request completion
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Email Verification</h2>
      <div>
        <label>Enter OTP:</label>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange} // Handle OTP input change
          placeholder="Enter your OTP"
          disabled={loading} // Disable input while loading
        />
      </div>

      <button onClick={handleVerify} disabled={loading || !otp}>
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>
    </div>
  );
};

export default OtpVerification;
