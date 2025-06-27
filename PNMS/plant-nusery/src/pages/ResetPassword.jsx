import { useState } from 'react';
import axios from '../services/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/reset-password', {
        email,
        newPassword,
        confirmPassword,
      });
      toast.success('Password reset successfully!');
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch {
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl hover:shadow-2xl cursor-pointer">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-pink-100 rounded-full border-2 border-pink-500 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <span className="text-4xl">🌺</span>
          </div>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow hover:shadow-xl cursor-pointer"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow hover:shadow-xl cursor-pointer"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-2xl font-poppins hover:bg-pink-600 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
