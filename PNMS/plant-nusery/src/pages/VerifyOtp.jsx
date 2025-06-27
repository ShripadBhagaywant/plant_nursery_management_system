import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../services/axiosInstance';

const VerifyOtp = () => {
  const [otpDigits, setOtpDigits] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  useEffect(() => {
    const devOtp = localStorage.getItem('testOtp');
    if (devOtp) {
      toast(`Your OTP is: ${devOtp}`, { duration: 4000 });
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    let interval = null;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    const updated = [...otpDigits];
    pasted.forEach((char, i) => {
      if (/^[0-9]$/.test(char)) updated[i] = char;
    });
    setOtpDigits(updated);
    inputsRef.current[pasted.length - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    try {
      await axios.post('/user/verify-otp', { email, otp });
      toast.success('OTP Verified Successfully!');
      navigate('/reset-password-form');
    } catch {
      toast.error('Invalid or Expired OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('/user/resend-reset-otp', { email });
      toast.success('OTP resent to your email');
      setIsResendDisabled(true);
      setTimer(30);
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 flex flex-col items-center shadow-xl hover:shadow-2xl cursor-pointer">
        {/* Top Section with Lock Icon */}
        <div className="w-full flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white-100 border-2 border-green-500 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer">
            <span className="text-3xl">🌼</span>
          </div>
        </div>

        <h2 className="text-xl font-poppins font-semibold text-center">Enter OTP</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col items-center">
          <div onPaste={handlePaste} className="flex justify-center space-x-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-lg font-bold  font-poppins border border-gray-500 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 hover:shadow-lg cursor-pointer"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl font-poppins shadow-md hover:shadow-xl cursor-pointer"
          >
            Verify OTP
          </button>

          <p className="text-sm text-gray-600 mt-2 font-poppins">
            Didn't receive OTP?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className={`${
                isResendDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-500 hover:underline'
              } font-medium font-poppins`}
            >
              {isResendDisabled ? `Resend in ${timer}s` : 'resend otp'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
