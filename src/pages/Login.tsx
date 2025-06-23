import { useState } from "react";
import googleSvg from "@/assets/google.svg";
import {
  signInWithGoogle,
  signInWithEmail,
} from "@/services/authService";
import { getUserUserName } from "@/services/userService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const searchUserName = async () => {
    if (email === "") {
      setError("Email is required");
      return;
    }
    try {
      const userName = await getUserUserName(email);
      if (userName === "") {
        setIsPasswordVisible(false);
        // Navigate to register page
        navigate("/register", { state: { email } });
        return;
      }
      setUserName(userName);
      setIsPasswordVisible(true);
      setError("");
    } catch (err) {
      setError("Error communicating with the server");
      return;
    }
  };
  const handleEmailLogin = async () => {
    if (password === "") {
      setError("Password is required");
      return;
    }
    try {
      await signInWithEmail(email, password);
      navigate("/profile");
    } catch (err) {
      setError("Login failed. Please check your email and password.");
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      const userName = await getUserUserName(user.email!);
      if (userName === "") {
        // Navigate to register page
        navigate("/register", { state: { email: user.email } });
        return;
      }
      navigate("/profile");
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-4">
      {/* Form */}
      <div className="bg-gray-100 p-4 w-full h-8/10 lg:w-1/3 lg:h-full rounded-xl border-1 border-gray-400 shadow-lg flex flex-col items-center justify-center gap-5 lg:gap-8">
        <p className="text-3xl font-bold mb-4 w-9/10">
          Login to save and like other peoples recipes.
        </p>
        {error && <div className="text-red-600 w-9/10">{error}</div>}

        {/* Email and Password Form */}
        <form className="w-full flex flex-col gap-6 lg:gap-8 items-center">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
            required
          />
          <div className="w-full flex flex-col items-center transition-all duration-300 ease-in-out">
            {isPasswordVisible ? (
              <div className="w-full flex flex-col gap-6 items-center animate-fade-in">
                <div className="w-9/10 flex flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    Welcome back {userName}, please type your password to
                    continue.
                  </p>
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded lg:text-xl w-full"
                    required
                  />
                </div>

                <button
                  type="button"
                  className="bg-mainGreen hover:bg-mainGreenHover text-white p-2 rounded lg:text-2xl w-7/10"
                  onClick={handleEmailLogin}
                >
                  Login
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="bg-mainGreen hover:bg-mainGreenHover text-white p-2 rounded lg:text-2xl w-7/10 transition-all duration-300 ease-in-out"
                onClick={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    setError("Please enter a valid email address");
                  } else {
                    setError("");
                    searchUserName();
                  }
                }}
              >
                Continue
              </button>
            )}
          </div>
        </form>
        <div className="lg:text-2xl">Or</div>

        {/* Sign in with Google */}
        <button
          className="flex items-center justify-center gap-3 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded w-7/10"
          onClick={handleGoogleLogin}
        >
          <img
            src={googleSvg}
            alt="Google Logo"
            className="w-7 h-7 lg:w-10 lg:h-10"
          />
          <span className="lg:text-2xl">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
