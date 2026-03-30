import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authAPI } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { setAuth, sessionToken } = useAuthStore();

  useEffect(() => {
    if (!sessionToken) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }
  }, [sessionToken, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(isNaN)) return;
    
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const focusIndex = Math.min(pastedData.length, 5);
    if (inputRefs.current[focusIndex]) {
       inputRefs.current[focusIndex].focus();
    } else {
       inputRefs.current[5].focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authAPI.verifyOtp({ otp: otpString });
      
      if (res.data?.data?.user && res.data?.data?.token) {
        setAuth(res.data.data.user, res.data.data.token);
        localStorage.setItem('lastLoggedInEmail', res.data.data.user.email);
        toast.success('Login Successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
       toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionToken) return null;

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid items-center justify-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

      <div className="w-full flex py-8 justify-center z-20 overflow-y-auto">
        <div className="w-full max-w-md m-auto px-4">
          <Card className="w-full p-8 bg-background/50 backdrop-blur-2xl border-glassBorder shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Security Check</h2>
                <p className="text-gray-400">Enter the 6-digit code sent to your email.</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="flex justify-between gap-2 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-12 sm:w-12 sm:h-14 bg-glass border border-glassBorder focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-center text-xl text-white font-bold transition-all focus:outline-none"
                    />
                  ))}
                </div>

                <Button type="submit" className="w-full mt-8" isLoading={isLoading}>
                  Verify & Proceed
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-400">
                Didn't receive the code?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-primary hover:text-blue-400 font-medium transition-colors">
                  Go back to Login
                </button>
              </p>
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
