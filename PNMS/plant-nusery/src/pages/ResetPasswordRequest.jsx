import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../services/axiosInstance';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/send-reset-otp', { email });
      toast.success('OTP sent to your email');
      localStorage.setItem('resetEmail', email);
      navigate('/verify-otp');
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl hover:shadow-2xl transition cursor-pointer">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center shadow-md hover:shadow-xl transition cursor-pointer">
            <span className="text-4xl">🍀</span>
          </div>
        </div>
        
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow hover:shadow-xl cursor-pointer"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-2xl font-poppins hover:bg-green-600 shadow-lg hover:shadow-2xl"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
