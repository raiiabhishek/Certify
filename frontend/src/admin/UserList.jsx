import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import { useNavigate } from "react-router";
import { FaCheckCircle, FaUserTimes } from "react-icons/fa";

export default function UserList() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(`${api}/users`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (result.status === 200) {
          setUsers(result.data.data);
        } else {
          setError("Unable to fetch users.");
        }
      } catch {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [api, authToken]);

  useEffect(() => {
    let filtered = users;
    if (filterVerified === "verified") {
      filtered = filtered.filter((user) => user.status === "verified");
    } else if (filterVerified === "not verified") {
      filtered = filtered.filter((user) => user.status === "not verified");
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterVerified]);

  const handleVerification = async (userId) => {
    try {
      const result = await axios.get(`${api}/admin/verify/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (result.status !== 200) setError("Failed to verify user.");
    } catch {
      setError("Failed to verify user.");
    }
  };

  const handleRevoke = async (userId) => {
    try {
      const result = await axios.get(`${api}/admin/revoke/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (result.status !== 200) setError("Failed to revoke verification.");
    } catch {
      setError("Failed to revoke verification.");
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">User Management</h2>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
            />
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified</option>
              <option value="not verified">Not Verified</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length === 0 ? (
              <div className="text-gray-500 col-span-full text-center">No users found.</div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/profile/${user._id}`)}
                      >
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-400 mt-1">Reg No: {user.registrationNumber}</p>
                    </div>
                    <div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          user.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {user.status === "not verified" ? (
                      <button
                        onClick={() => handleVerification(user._id)}
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm shadow"
                      >
                        <FaCheckCircle className="mr-2" /> Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevoke(user._id)}
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow"
                      >
                        <FaUserTimes className="mr-2" /> Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
