import React, { useState } from "react";
import Cookies from "js-cookie";
import ClipLoader from "react-spinners/ClipLoader";

const Login = ({ setIsLoggedIn, setIsRegistering }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(
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

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        Cookies.set("token", data.token, {
          expires: 30,
          sameSite: "None",
          secure: true,
        });
        Cookies.set("id", data.id, {
          expires: 30,
          sameSite: "None",
          secure: true,
        });

        setIsLoggedIn(true);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Login error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
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
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className="w-full p-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
