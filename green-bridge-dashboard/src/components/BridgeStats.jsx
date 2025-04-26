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
    const [selectedChain, setSelectedChain] = useState('all');
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        async function fetchData() {
            try {
                // Use production URL by default, fallback to localhost for development
                const apiUrl = import.meta.env.VITE_API_URL || 'https://green-bridge-monitor-backend.onrender.com';
                console.log('Fetching data from:', apiUrl);
                const res = await axios.get(`${apiUrl}/api/transfers`);
                console.log('Received data:', res.data);
                setData(res.data);
            } catch (error) {
                console.error('Error fetching transfers:', error);
                console.error('Error details:', error.response?.data || error.message);
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
                backgroundColor: '#6366F1',
                borderRadius: 8,
            },
            {
                label: 'CO₂ Saved (g)',
                data: data.length > 0 ? data.map(d => d.carbonSaved) : [],
                backgroundColor: '#10B981',
                borderRadius: 8,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#E5E7EB',
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: 'Bridge Transfers and CO₂ Savings',
                color: '#F9FAFB',
                font: {
                    size: 20,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                titleColor: '#F9FAFB',
                bodyColor: '#E5E7EB',
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
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(75, 85, 99, 0.2)' }
            },
            y: {
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(75, 85, 99, 0.2)' }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-indigo-400 font-bold">Loading Green Bridge Monitor...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-6">
                {/* Test Data Warning */}
                <div className="bg-yellow-900/50 border border-yellow-800 rounded-xl p-4">
                    <p className="text-yellow-200 text-sm">
                        ⚠️ This dashboard is currently displaying test data for demonstration purposes. The numbers shown are not real bridge transfers.
                    </p>
                </div>

                {/* Filters Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Chain</label>
                            <select
                                value={selectedChain}
                                onChange={(e) => setSelectedChain(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 rounded-lg border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="all">All Chains</option>
                                <option value="avalanche">Avalanche (L1)</option>
                                <option value="fuji">Fuji (L1)</option>
                                <option value="ethereum">Ethereum</option>
                                <option value="polygon">Polygon</option>
                                <option value="arbitrum">Arbitrum</option>
                                <option value="optimism">Optimism</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Time Range</label>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 rounded-lg border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="all">All time</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Chart Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="h-[500px]">
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">📖 How to Read This Graph</h2>
                    <p className="text-gray-400 mb-4">
                        This dashboard compares the environmental impact of token transfers between Avalanche subnets (using Avalanche Warp Messaging) 
                        versus traditional cross-chain bridges (like those on Ethereum). The blue bars show the number of tokens bridged, 
                        and the green bars show the estimated grams of CO₂ saved by using Avalanche's native cross-subnet communication.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Methodology</h3>
                    <p className="text-gray-400 mb-4">
                        The CO₂ savings are calculated by comparing the energy consumption of:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                        <li>Traditional cross-chain bridges (which require multiple transactions and validators)</li>
                        <li>Avalanche Warp Messaging (which uses native subnet communication)</li>
                    </ul>
                    <p className="text-gray-500 text-sm">
                        Sustainability estimates are provided by the 
                        <a href="https://carbon-ratings.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline ml-1">
                            Crypto Carbon Ratings Institute (CCRI)
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BridgeStats;