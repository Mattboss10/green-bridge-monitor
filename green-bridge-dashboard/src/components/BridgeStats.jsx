import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 🛠️ Register necessary ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
        labels: data.length > 0 ? data.map(d => `${d.fromChain} → ${d.toChain}`) : ['No Data'],
        datasets: [
            {
                label: 'Tokens Bridged',
                data: data.length > 0 ? data.map(d => parseFloat(d.amount)) : [],
                backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-500
            },
            {
                label: 'CO₂ Saved (g)',
                data: data.length > 0 ? data.map(d => d.carbonSaved) : [],
                backgroundColor: 'rgba(34, 197, 94, 0.7)', // green-500
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#374151' // gray-700
                }
            },
            title: {
                display: true,
                text: 'Bridge Transfers and CO₂ Savings',
                color: '#111827', // gray-900
                font: {
                    size: 24
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.label === 'CO₂ Saved (g)') {
                            label += context.parsed.y + ' grams CO₂ saved';
                        } else {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#374151' },
                grid: { color: '#E5E7EB' }
            },
            y: {
                ticks: { color: '#374151' },
                grid: { color: '#E5E7EB' }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-blue-600 font-bold">Loading Green Bridge Monitor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">🌿 Green Bridge Monitor 🌿</h1>

            <div className="max-w-6xl w-full">
                <Bar options={chartOptions} data={chartData} />
            </div>

            <div className="mt-8 max-w-4xl text-center text-gray-700">
                <h2 className="text-2xl font-semibold mb-2">📖 How to Read This Graph</h2>
                <p className="mb-4">
                    Each bar represents a token transfer between Avalanche subnets. The blue bars show the number of tokens bridged, 
                    and the green bars show the estimated grams of CO₂ saved by using Avalanche Warp Messaging instead of an external bridge.
                </p>
                <p className="text-gray-500 text-sm">
                    Sustainability estimates are provided by the 
                    <a href="https://carbon-ratings.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                        Crypto Carbon Ratings Institute (CCRI)
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default BridgeStats;