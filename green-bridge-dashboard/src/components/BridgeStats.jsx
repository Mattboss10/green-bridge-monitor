import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// 🛠️ Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const BridgeStats = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get('http://localhost:3001/transfers');
                setData(res.data);
            } catch (error) {
                console.error('Error fetching transfers:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const chartData = {
        labels: data.length > 0 ? data.map(d => new Date(d.timestamp * 1000).toLocaleDateString()) : [],
        datasets: [
            {
                label: 'Tokens Bridged',
                data: data.length > 0 ? data.map(d => parseFloat(d.amount)) : [],
                borderColor: 'blue',
                backgroundColor: 'lightblue',
            },
            {
                label: 'CO₂ Saved (g)',
                data: data.length > 0 ? data.map(d => d.carbonSaved) : [],
                borderColor: 'green',
                backgroundColor: 'lightgreen',
            }
        ]
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-blue-600 font-bold">Loading Green Bridge Monitor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">🌿 Green Bridge Monitor 🌿</h1>
            {data.length > 0 ? (
                <div className="w-full max-w-4xl">
                    <Line data={chartData} />
                </div>
            ) : (
                <p className="text-gray-600 text-lg text-center">No bridge events yet. Waiting for activity...</p>
            )}
        </div>
    );
};

export default BridgeStats;