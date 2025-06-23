import { useState } from "react";
import { registerWithEmail } from "@/services/authService";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email!;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerWithEmail(
        email,
        password,
        firstName,
        lastName,
        userName,
        bio
      );
      navigate("/profile");
      // Registration successful, redirect to profile or login page
    } catch (err) {
      setError("Registration failed. Email might be in use.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-4">
      {/* Form */}
      <div className="bg-gray-100 p-4 w-full h-8/10 lg:w-1/3 lg:h-full rounded-xl border-1 border-gray-400 shadow-lg flex flex-col items-center justify-center gap-5 lg:gap-8">
        <p className="text-3xl font-bold mb-4 w-9/10">
          Let's get you registered! Please fill in the details below.
        </p>
        {error && (
          <p className="text-red-500 text-sm w-9/10 text-center">
            {error}
          </p>
        )}

        <form className="w-full flex flex-col gap-6 lg:gap-8 items-center">
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
          />
          <input
            type="text"
            placeholder="User Name"
            onChange={(e) => setUserName(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
          />
          <input
            type="text"
            placeholder="Bio (optional)"
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded lg:text-xl w-9/10"
          />
          <button
            type="submit"
            className="bg-mainGreen hover:bg-mainGreenHover text-white p-2 rounded lg:text-2xl w-7/10"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
