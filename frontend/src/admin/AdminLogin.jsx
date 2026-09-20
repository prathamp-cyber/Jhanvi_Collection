import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/admin/assets.js';
import { BRAND_NAME } from '../config/brand.js';
import { Button, Input, Card } from './components/ui';

const AdminLogin = ({ setToken, backendUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const url = (backendUrl || 'http://localhost:4000') + '/api/user/admin';
      const response = await axios.post(url, { email, password });
      
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Admin Logged In Successfully");
      } else {
        setErrorMessage(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          setErrorMessage("Too many attempts. Please try again in 15 minutes.");
        } else if (error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Invalid credentials. Please check your email and password.");
        }
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setErrorMessage("Backend server is not running on port 4000!");
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-root min-h-screen flex items-center justify-center p-4 bg-[#f6f3ec]">
      <div className="w-full max-w-md admin-animate-fade-in">
        <Card padding="lg" className="shadow-lg border-[#e6e1d6]">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <img src={assets.jhanvi_mark} className="h-12 w-auto object-contain mb-3" alt={BRAND_NAME} />
            <h1 className="text-2xl font-bold text-[#0a1f44] tracking-tight">{BRAND_NAME} Admin</h1>
            <p className="text-sm text-[#6b7280] mt-1">Enter your credentials to access the shop dashboard</p>
          </div>

          {/* Form Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-[#fee2e2] border border-[#fecaca] rounded-lg flex items-start gap-2.5 text-[#b91c1c] text-sm font-medium">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            <Input
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              autoFocus
              isDisabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                isDisabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="aria-label-toggle absolute right-3 top-[38px] text-[#6b7280] hover:text-[#0a1f44] p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1f44]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.046 10.046 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-2 text-base font-semibold"
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>
        <p className="text-center text-xs text-[#6b7280] mt-6">
          &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
