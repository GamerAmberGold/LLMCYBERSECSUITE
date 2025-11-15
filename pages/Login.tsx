
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C327.3 125.2 290.5 108 248 108c-73.4 0-134.3 59.9-134.3 134.3s60.9 134.3 134.3 134.3c81.8 0 112.5-52.5 115.4-78.1H248v-95.6h236.3c2.3 12.7 3.7 26.5 3.7 40.8z"></path>
    </svg>
);

const GitHubIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
        <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-6-2.3zm47.2 4.5c-1.2 2.3-1.2 5.2 1.5 6.8 2.9 1.6 6.2 1.2 7.4-1.5s1.2-5.2-1.5-6.8c-2.9-1.5-6.2-1.2-7.4 1.5zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-6-2.3zm47.2 4.5c-1.2 2.3-1.2 5.2 1.5 6.8 2.9 1.6 6.2 1.2 7.4-1.5s1.2-5.2-1.5-6.8c-2.9-1.5-6.2-1.2-7.4 1.5zM496 256c0 137-111 248-248 248S0 393 0 256 111 8 248 8s248 111 248 248zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.2 1.6 1.6 4.3 1.6 5.9 0 1.6-1.6 1.6-3.9 0-5.2-1.6-1.6-4.3-1.6-5.9 0z"></path>
    </svg>
);


const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('analyst@cybersec.io');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<UserRole>(UserRole.ANALYST);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, role);
    // Note: login function handles navigation, but we'll set loading to false in case of an error.
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-primary-950/40 border-r border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl animate-float [animation-duration:12s]"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-primary-700/20 rounded-full filter blur-3xl animate-float [animation-delay:-4s] [animation-duration:15s]"></div>
        <div className="text-center p-8 z-10">
          <Shield className="mx-auto h-16 w-16 text-primary-400" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Welcome to CyberSec Suite
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The all-in-one platform for modern Security Operations.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
           <div className="grid gap-4">
             <Button variant="outline" onClick={() => navigate('/google-signin')} disabled={isLoading}>
                <GoogleIcon/> 
                Continue with Google
            </Button>
             <Button variant="outline" onClick={() => navigate('/github-signin')} disabled={isLoading}>
                <GitHubIcon/>
                 Continue with GitHub
            </Button>
           </div>
           <div className="relative">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
             </div>
           </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <label htmlFor="password">Password</label>
                <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
                required
                disabled={isLoading} />
            </div>
            <div className="grid gap-2">
                <label htmlFor="role">Role</label>
                 <select
                    id="role"
                    name="role"
                    required
                    className="w-full appearance-none border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={isLoading}
                >
                    <option value={UserRole.ANALYST}>Analyst</option>
                    {/* Fix: Corrected the malformed option tag and removed extraneous pasted content. */}
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a href="#" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
