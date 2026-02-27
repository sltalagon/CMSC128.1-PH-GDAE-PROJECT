import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Key } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded demo credentials based on your screenshot
    if (email === 'demo@phgdae.edu.ph' && password === 'demo123') {
      // Set the auth flag that App.jsx looks for
      localStorage.setItem('isAdmin', 'true');
      // Redirect to the admin dashboard
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please use the demo credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[400px] border border-slate-100">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-slate-400" size={18} />
              </div>
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-slate-400" size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-600/20"
          >
            Sign In
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Demo Credentials Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <Mail size={14} className="opacity-70" /> <span>Email: demo@phgdae.edu.ph</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Key size={14} className="opacity-70" /> <span>Password: demo123</span>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Request Access</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;