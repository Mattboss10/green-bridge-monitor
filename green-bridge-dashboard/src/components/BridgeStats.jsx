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
    const [architectures, setArchitectures] = useState([]);
    const [selectedArchitecture, setSelectedArchitecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://green-bridge-monitor-backend.onrender.com';
                console.log('Fetching data from:', apiUrl);
                const res = await axios.get(`${apiUrl}/api/architectures`);
                console.log('Received data:', res.data);
                setArchitectures(res.data);
                if (res.data.length > 0) {
                    setSelectedArchitecture(res.data[0]);
                }
            } catch (error) {
                console.error('Error fetching architectures:', error);
                console.error('Error details:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const chartData = selectedArchitecture ? {
        labels: ['Throughput (tx/sec)', 'Finality (seconds)'],
        datasets: [
            {
                label: selectedArchitecture.name,
                data: [
                    selectedArchitecture.throughput,
                    selectedArchitecture.finality
                ],
                backgroundColor: '#6366F1',
                borderRadius: 8,
            }
        ]
    } : null;

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
                text: 'Blockchain Performance Metrics',
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
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        const unit = context.label.split('(')[1].replace(')', '');
                        return `${label}: ${value} ${unit}`;
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
                        ⚠️ This dashboard is currently displaying test data for demonstration purposes. The numbers shown are estimates based on public data.
                    </p>
                </div>

                {/* Filters Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Select Blockchain</label>
                            <select
                                value={selectedArchitecture?.id || ''}
                                onChange={(e) => {
                                    const arch = architectures.find(a => a.id === parseInt(e.target.value));
                                    setSelectedArchitecture(arch);
                                }}
                                className="w-full bg-gray-700 text-gray-200 rounded-lg border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {architectures.map(arch => (
                                    <option key={arch.id} value={arch.id}>{arch.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="h-[500px]">
                        {chartData && <Bar options={chartOptions} data={chartData} />}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">📖 How to Read This Dashboard</h2>
                    <p className="text-gray-400 mb-4">
                        This dashboard compares different blockchain architectures across multiple metrics, including 
                        performance, energy efficiency, and ecosystem health. The chart shows key performance metrics, 
                        while the detailed view provides additional context about each blockchain's characteristics.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Methodology</h3>
                    <p className="text-gray-400 mb-4">
                        The metrics are calculated based on:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                        <li>Consensus mechanism efficiency and energy requirements</li>
                        <li>Network performance and scalability</li>
                        <li>Developer activity and ecosystem growth</li>
                        <li>Network decentralization and adoption metrics</li>
                    </ul>
                    <p className="text-gray-500 text-sm">
                        Sustainability estimates are based on public data and research from the 
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