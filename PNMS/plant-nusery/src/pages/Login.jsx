import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { BugDroid } from "@phosphor-icons/react"; // Google icon

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await loginUser({ email, password });
      toast.success('🌻 Welcome..');
      login(token);

      const decoded = jwtDecode(token);
      const role = decoded.role || decoded.roles?.[0] || 'ROLE_USER';
      role === 'ROLE_ADMIN' ? navigate('/dashboard') : navigate('/home');
    } catch (err) {
      toast.error('❌ Oops.. Invalid credentials');
    }
  };

  const handleGoogleSignIn = () => {
    // 🔐 Placeholder for Google Auth logic (e.g., Firebase)
    toast.info('Google login not yet implemented');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl hover:shadow-lg cursor-pointer">
        {/* Avatar Icon */}
         <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-100 rounded-full border-2 border-white-800 flex items-center justify-center shadow-md hover:shadow-xl transition cursor-pointer">
            <span className="text-4xl">🌿</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
             focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
             focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
            required
          />

          <div className="flex justify-between text-sm font-poppins">
            <Link to="/reset-password" className="text-green-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 border border-gray-300 text-white py-2 rounded-2xl hover:bg-green-600 font-poppins transition duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        {/* OR Separator */}
        <div className="text-center text-gray-500 my-3 font-poppins">or</div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-2xl hover:bg-gray-100 font-poppins shadow-md"
        >
        <BugDroid size={24} weight="bold"/>Continue with Google
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm mt-4 font-poppins">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
