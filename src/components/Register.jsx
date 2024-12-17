import React, { useState } from "react";
import Cookies from "js-cookie";
import ClipLoader from "react-spinners/ClipLoader";

const Register = ({ setIsRegistering, setIsLoggedIn }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Send the registration request
      const response = await fetch(
        "https://api-hearmify.vercel.app/api/songs/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // After successful registration, try logging in with the same credentials
        const loginResponse = await fetch(
          "https://api-hearmify.vercel.app/api/songs/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              password,
            }),
          }
        );

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          // Set cookies with the token and ID after successful login
          Cookies.set("token", loginData.token, {
            expires: 30,
            sameSite: "None",
            secure: true,
          });
          Cookies.set("id", loginData.id, {
            expires: 30,
            sameSite: "None",
            secure: true,
          });

          setIsLoggedIn(true);
        } else {
          setError(loginData.error || "Login failed.");
        }
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Registration error:", error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4cabe6" size={50} aria-label="Loading Spinner" />
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className="w-full p-3 mt-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
