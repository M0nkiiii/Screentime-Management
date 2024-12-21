import React, { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Bar } from 'react-chartjs-2';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../App';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboardScreen() {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        userUsageData: [],
        appUsageData: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigation = useNavigation();
    const { logout } = useContext(AuthContext); // Use AuthContext for logout

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = await AsyncStorage.getItem('adminToken'); // Fetch token from AsyncStorage
                if (!token) {
                    setError('No admin token found.');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/usage/admin-dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Admin Dashboard API Response:', data);
                setDashboardData(data);
            } catch (err) {
                console.error('Error fetching admin dashboard data:', err);
                setError('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        try {
            await logout(); // Use the context's logout method
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            alert('Failed to log out. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div style={styles.loaderContainer}>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p>Error: {error}</p>
            </div>
        );
    }

    const screenWidth = window.innerWidth;

    const appUsageChartData = {
        labels: dashboardData.appUsageData.map((app) => app.appName),
        datasets: [
            {
                label: 'App Usage (seconds)',
                data: dashboardData.appUsageData.map((app) => app.totalDuration),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const appUsageChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.raw + ' seconds';
                    },
                },
            },
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.scrollContent}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <h2 style={styles.subtitle}>Total Users: {dashboardData.totalUsers}</h2>

                {/* User Usage Table */}
                <table style={styles.dataTable}>
                    <thead>
                        <tr>
                            <th style={styles.dataTableHeaderAndCell}>Username</th>
                            <th style={styles.dataTableHeaderAndCell}>Total Usage (seconds)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.userUsageData.map((userUsage) => (
                            <tr key={userUsage.userId}>
                                <td style={styles.dataTableHeaderAndCell}>{userUsage.user?.username || 'Unknown User'}</td>
                                <td style={styles.dataTableHeaderAndCell}>{userUsage.totalDuration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* App Usage Bar Chart */}
                <h3 style={styles.chartTitle}>App Usage: Highest vs Lowest</h3>
                <div style={styles.chart}>
                    <Bar
                        data={appUsageChartData}
                        options={appUsageChartOptions}
                        width={screenWidth - 40}
                        height={250}
                    />
                </div>

                {/* Logout Button */}
                <div style={styles.logoutContainer}>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    scrollContent: {
        flexGrow: 1,
        overflowY: 'auto',
        paddingRight: '10px',
        marginBottom: '0',
        paddingBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '18px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    chartTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginVertical: '10px',
    },
    chart: {
        marginVertical: '20px',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: '#fff',
    },
    dataTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    dataTableHeaderAndCell: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    },
    logoutContainer: {
        marginTop: '20px',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
};
