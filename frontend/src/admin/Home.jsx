import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ComposedChart,
} from "recharts";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import axios from "axios";

const COLORS = ["#346f73", "#f3730e", "#EF4444", "#F59E0B"];

export default function Home() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  const handleMouseEnter = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const renderCustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const dataPoint = payload[0].payload;
      const percentage = (
        (dataPoint.value / data.reduce((sum, d) => sum + d.value, 0)) *
        100
      ).toFixed(2);

      return (
        <div className="backdrop-blur-md bg-white/30 p-2 border border-gray-200/50 shadow-md rounded-md">
          <p className="font-bold text-gray-800">{`${dataPoint.name}: ${percentage}%`}</p>
          <p className="text-gray-600">{`Value: ${dataPoint.value}`}</p>
        </div>
      );
    }

    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    let dayWithSuffix = day;
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`;
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`;
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`;
    } else {
      dayWithSuffix = `${day}th`;
    }

    return `${dayWithSuffix} ${month} ${year}`;
  };

  const parseDate = (dateString) => {
    const parts = dateString.split(" ");
    const day = parseInt(parts[0], 10);
    const month = parts[1];
    const year = parseInt(parts[2], 10);
    const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth();
    return new Date(year, monthIndex, day);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/analytics`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const analyticsData = response.data.data;
        setAnalytics(analyticsData);
        setLoading(false);

        const certificates = analyticsData?.certificates || [];
        const reports = analyticsData?.reports || [];

        const aggregatedData = {};

        certificates.forEach((cert) => {
          const date = formatDate(cert.createdAt);
          if (!aggregatedData[date]) {
            aggregatedData[date] = { date, certificates: 0, reports: 0 };
          }
          aggregatedData[date].certificates++;
        });

        reports.forEach((report) => {
          const date = formatDate(report.createdAt);
          if (!aggregatedData[date]) {
            aggregatedData[date] = { date, certificates: 0, reports: 0 };
          }
          aggregatedData[date].reports++;
        });

        const timeSeriesArray = Object.values(aggregatedData);
        timeSeriesArray.sort(
          (a, b) => new Date(parseDate(a.date)) - new Date(parseDate(b.date))
        );
        setTimeSeriesData(timeSeriesArray);
      } catch (e) {
        console.log(e);
        setError("Failed to load analytics data.");
        setLoading(false);
      }
    };
    if (authToken) {
      fetchData();
    }
  }, [authToken, api]);

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
    { name: "Certificates", value: analytics?.certificateCount || 0 },
    { name: "Reports", value: analytics?.reportCount || 0 },
  ];

  const data2 = [
    { name: "Verified", value: analytics?.verifiedCounts, color: "#f3730e" },
    {
      name: "Unverified",
      value: analytics?.unverifiedCounts,
      color: "#FF0000",
    },
  ];

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value, fill } = props;
    const radius = 10;
    return (
      <g>
        <text
          x={x + width / 2}
          y={y - radius}
          fill={fill}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-grow overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative">
            <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
              Welcome <span className="text-black-600"> to your Dashboard</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Document and User Distribution
              </h2>
              <div className="h-80 w-full flex">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      activeIndex={activeIndex}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="50%" height="100%">
                  <BarChart
                    data={data2}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {data2.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="value"
                        content={renderCustomizedLabel}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Certificates and Reports per Day
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={timeSeriesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="certificates" barSize={20} fill="#413ea0" />
                  <Bar dataKey="reports" barSize={20} fill="#FF0000" /> {}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
