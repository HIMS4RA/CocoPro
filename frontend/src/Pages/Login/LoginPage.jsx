import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { CocoPro } from './CocoPro';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // const handleLogin = async (e) => {

    //     e.preventDefault();
    //     console.log('Login attempt', { email, password, rememberMe });

    //     try {
    //         const response = await axios.post("http://localhost:8080/auth/login", 
    //             { email, password }, 
    //             { withCredentials: true }
    //         );

    //         if (response.data.role) {
    //             setUser(response.data);
    //             if (response.data.role === "Worker") navigate("/worker");
    //             else if (response.data.role === "Supervisor") navigate("/supervisor");
    //             else if (response.data.role === "Manager") navigate("/manager");
    //             else if (response.data.role === "Owner") navigate("/owner");
    //         } else {
    //             alert("Invalid credentials");
    //         }
    //     } catch (error) {
    //         console.error("Login failed", error);
    //     }
    // };

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post(
              "http://localhost:8080/auth/login", 
              { email, password },
              { withCredentials: true }
          );
  
          if (response.data && response.data.role) {
              setUser(response.data);
              // Redirect based on role
              navigate(`/${response.data.role.toLowerCase()}`);
          } else {
              alert("Invalid credentials");
          }
      } catch (error) {
          console.error("Login failed", error);
      }
  };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-amber-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fphoto_96863735_green-coconut-fruit-texture-and-background-coconut-fruits.html&psig=AOvVaw0YbY_lcz_y5Emw1o_e5MP8&ust=1743047544598000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDfj7nspowDFQAAAAAdAAAAABAE')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-white text-center">
          <CocoPro className="w-72 h-auto mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">Automated Coconut Husk Processing</h2>
          <p className="text-lg max-w-md">Welcome to the future of coconut processing. Efficient, sustainable, and intelligent.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-12 text-center">
            <CocoPro className="w-48 h-auto mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-800">CocoPro System</h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login to your account</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 py-2 px-4 border"
                    placeholder="your@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 py-2 px-4 border"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                  <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium text-green-600 hover:text-green-800"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">System access is restricted to authorized personnel only.</div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} CocoPro. All rights reserved.</div>
        </div>
      </div>
    </div>
    );
};

export default Login;
