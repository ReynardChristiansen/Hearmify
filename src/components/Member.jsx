import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Function to fetch members, placed outside useEffect for reuse
  const fetchMembers = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        "https://api-hearmify.vercel.app/api/songs/getAllUser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data);

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
      else if(userResponse.ok && userData.role !== "admin"){
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members on initial load
  useEffect(() => {
    fetchMembers();
  }, []);

  const handlePromote = async (memberId) => {
    setLoading(true);
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        `https://api-hearmify.vercel.app/api/songs/promote/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Member promoted to admin!");
        // Refresh the member list after promotion
        fetchMembers(); // Call fetchMembers to refresh the list
      } else {
        alert("Failed to promote member");
      }
    } catch (error) {
      console.error("Error promoting member:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <Link
          to="/"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Manage Members
        </h1>

        <div className="overflow-x-auto">
          {members.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members
                  .filter((member) => member.role === "user")
                  .map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-2">{member.name}</td>
                      <td className="px-4 py-2">{member.role}</td>
                      <td className="px-4 py-2 text-center">
                        {/* Show the Promote button only if the role is 'user' */}
                        {isAdmin && (
                          <button
                            onClick={() => handlePromote(member.id)}
                            className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600"
                          >
                            Promote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No members found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
