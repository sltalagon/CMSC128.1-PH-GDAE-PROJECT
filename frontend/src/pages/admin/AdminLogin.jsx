import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'no_privileges') {
      setErrorMessage("Access Denied: Your Google account does not have admin privileges.");
      
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams]);

  const handleGoogleSignIn = () => {
    const backendUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:8080';

    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[400px] border border-slate-100 text-center">
        
        {/* Back to Home button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to Home
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Access</h2>
          <p className="text-slate-500 text-sm mt-2">Sign in using your authorized Google account</p>
        </div>

        {/* Conditionally rendered Error Card styled with Tailwind */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-left flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <span className="text-red-800 font-medium">{errorMessage}</span>
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-50 transition-colors focus:ring-4 focus:ring-slate-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-left">
          <p className="font-semibold text-blue-900 mb-2">Note:</p>
          <div className="flex items-start gap-2 text-blue-800 mb-1">
            <Mail size={16} className="opacity-70 mt-0.5 shrink-0" /> 
            <span>You must use an email address that has been pre-approved by the system administrators.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
