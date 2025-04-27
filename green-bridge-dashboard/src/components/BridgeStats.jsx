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
        labels: [
            'Throughput (tx/sec)',
            'Finality (seconds)',
            'Energy Efficiency',
            'CO₂ Emissions',
            'Developer Ecosystem',
            'Decentralization',
            'Network Adoption'
        ],
        datasets: [
            {
                label: selectedArchitecture.name,
                data: [
                    selectedArchitecture.throughput,
                    selectedArchitecture.finality,
                    // Convert qualitative metrics to numerical values for chart
                    selectedArchitecture.energyEfficiency.includes('High') ? 3 : 
                    selectedArchitecture.energyEfficiency.includes('Medium') ? 2 : 1,
                    selectedArchitecture.co2Emissions.includes('Low') ? 3 : 
                    selectedArchitecture.co2Emissions.includes('Medium') ? 2 : 1,
                    selectedArchitecture.developerEcosystem.includes('Very Large') ? 4 :
                    selectedArchitecture.developerEcosystem.includes('Large') ? 3 :
                    selectedArchitecture.developerEcosystem.includes('Growing') ? 2 : 1,
                    selectedArchitecture.decentralization.includes('High') ? 3 :
                    selectedArchitecture.decentralization.includes('Medium') ? 2 : 1,
                    selectedArchitecture.networkAdoption.includes('Very High') ? 4 :
                    selectedArchitecture.networkAdoption.includes('High') ? 3 :
                    selectedArchitecture.networkAdoption.includes('Medium') ? 2 : 1
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
                text: 'Blockchain Architecture Comparison',
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
                        const metric = context.label.split('(')[0].trim();
                        
                        // Return qualitative values for non-numerical metrics
                        if (metric === 'Energy Efficiency') {
                            return `${label}: ${selectedArchitecture.energyEfficiency}`;
                        } else if (metric === 'CO₂ Emissions') {
                            return `${label}: ${selectedArchitecture.co2Emissions}`;
                        } else if (metric === 'Developer Ecosystem') {
                            return `${label}: ${selectedArchitecture.developerEcosystem}`;
                        } else if (metric === 'Decentralization') {
                            return `${label}: ${selectedArchitecture.decentralization}`;
                        } else if (metric === 'Network Adoption') {
                            return `${label}: ${selectedArchitecture.networkAdoption}`;
                        } else {
                            // Return numerical values with units for throughput and finality
                            const unit = context.label.split('(')[1].replace(')', '');
                            return `${label}: ${value} ${unit}`;
                        }
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

                {/* Chart Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="h-[500px]">
                        {chartData && <Bar options={chartOptions} data={chartData} />}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">📖 How to Read This Graph</h2>
                    <p className="text-gray-400 mb-4">
                        This graph compares different blockchain architectures across multiple metrics. The blue bars show:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                        <li>Throughput: Transactions per second</li>
                        <li>Finality: Time to confirm transactions</li>
                        <li>Energy Efficiency: Overall energy consumption</li>
                        <li>CO₂ Emissions: Environmental impact</li>
                        <li>Developer Ecosystem: Size and activity of developer community</li>
                        <li>Decentralization: Distribution of network control</li>
                        <li>Network Adoption: Current usage and growth</li>
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