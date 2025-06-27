import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { toast } from 'sonner';
import { BugDroid } from "@phosphor-icons/react"; // Optional Google icon

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("🎉 Registered successfully!");
      navigate('/login');
    } catch (err) {
      toast.error("❌ Registration failed!");
    }
  };

  const handleGoogleSignUp = () => {
    toast.info("Google signup not implemented yet.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl hover:shadow-lg cursor-pointer">
        {/* Avatar Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-yellow-100 rounded-full border-2 border-white-800 flex items-center justify-center shadow-md hover:shadow-xl transition cursor-pointer">
            <span className="text-4xl">🌻</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
            focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
            focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
            focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-2xl hover:bg-green-600 font-poppins transition duration-300 shadow-lg hover:shadow-xl"
          >
            Register
          </button>
        </form>

        {/* OR Separator */}
        <div className="text-center text-gray-500 my-3 font-poppins">or</div>

        {/* Google Sign-Up */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-2xl hover:bg-gray-100 font-poppins shadow-md"
        >
          <BugDroid size={24} weight="bold" />
          Sign up with Google
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-4 font-poppins">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
