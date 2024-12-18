import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";

const DisplayHome = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate(); // To redirect after logout

  useEffect(() => {
    const fetchSongs = async () => {
      const token = Cookies.get("token");

      try {
        const response = await fetch(
          "https://api-hearmify.vercel.app/api/songs/getAllSongs",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data = await response.json();
        setSongs(data);

        const userResponse = await fetch(
          `https://api-hearmify.vercel.app/api/songs/getUser`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = await userResponse.json();

        if (userResponse.ok && userData.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    // Clear all cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    // Redirect to login page
    window.location.reload();
  };

  // Filtered songs by title or lyrics
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.lyrics.some((line) =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <ClipLoader
          color="#4cabe6"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="flex flex-row justify-between items-center">
        <div className="flex">

        <div className="p-2">
          {isAdmin && (
            <Link
              to="/create"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Create
            </Link>
          )}
        </div>

        <div className="p-2">
          {isAdmin && (
            <Link
              to="/Member"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Member
            </Link>
          )}
        </div>
        </div>


        <div className="p-2">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Song List
        </h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search songs by title or lyrics"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-y-auto max-h-[400px]">
          {filteredSongs && filteredSongs.length > 0 ? (
            <ul className="space-y-4">
              {filteredSongs.map((song) => (
                <li
                  key={song.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <Link
                    to={`/${song.id}`}
                    className="block text-lg font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {song.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No songs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayHome;
