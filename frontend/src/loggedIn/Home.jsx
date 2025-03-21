import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import Footer from "../Footer";
import { PieChart, Pie, Cell, Legend } from "recharts";

export default function Home() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("fetching");
      try {
        const response = await axios.get(`${api}/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data.data);
        setLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log(e);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };
    if (authToken) {
      fetchProfile();
    }
  }, [authToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const data = [
    { name: "Certificates", value: user?.certificates?.length || 0 },
    { name: "Reports", value: user?.reports?.length || 0 },
  ];
  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div>
      <Nav />
      <div className="px-4 lg:px-8 xl:px-10 my-5 xl:my-10 space-y-8 xl:space-y-20 mx-auto max-w-7xl">
        <div className="relative">
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Welcome <span className="text-blue">{user.name} </span> !
          </h1>
        </div>
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
      <Footer />
    </div>
  );
}
