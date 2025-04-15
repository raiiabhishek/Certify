import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import Footer from "../Footer";

export default function UserList() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);

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
          setLoading(false);
        } else {
          setError(result.data.data);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [api, authToken]);

  useEffect(() => {
    // Filter and search logic
    let filtered = users;

    // Filter by verified status
    if (filterVerified === "verified") {
      filtered = filtered.filter((user) => user.status === "verified");
    } else if (filterVerified === "not verified") {
      filtered = filtered.filter((user) => user.status === "not verified");
    }

    // Search by name or email
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
      console.log(authToken);
      const result = await axios.get(`${api}/admin/verify/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (result.status === 200) {
      } else {
        setError("Failed to update user status");
      }
    } catch (err) {
      setError("Failed to update user status.");
    }
  };
  const handleRevoke = async (userId) => {
    try {
      const result = await axios.get(`${api}/admin/revoke/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (result.status === 200) {
      } else {
        setError("Failed to update user status");
      }
    } catch (err) {
      setError("Failed to update user status.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-700">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-grow overflow-y-auto">
        <div className="flex-1 container mx-auto p-5 px-5 lg:px-10 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">User List</h2>

          <div className="mb-4 flex items-center space-x-2 flex-wrap md:flex-nowrap">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto mb-2 md:mb-0 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 ml-0 md:ml-2"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="not verified">Not Verified</option>
            </select>
          </div>

          <div className="overflow-x-auto flex flex-col">
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left w-1/5">Name</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">Email</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">
                    Registration Number
                  </th>
                  <th className="py-2 px-4 border-b text-left w-1/8">Status</th>
                  <th className="py-2 px-4 border-b text-left w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      {user.registrationNumber}
                    </td>
                    <td className="py-2 px-4 border-b">{user.status}</td>
                    <td className="py-2 px-4 border-b">
                      {user.status === "not verified" ? (
                        <button
                          onClick={() =>
                            handleVerification(user._id, user.status)
                          }
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRevoke(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                        >
                          Revoke Verification
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
