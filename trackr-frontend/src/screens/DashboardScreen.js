import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

import { fetchDailyUsage, triggerPrediction } from '../config/api';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);


const DashboardScreen = () => {
    const [data, setData] = useState(null);
    const [weeklyUsage, setWeeklyUsage] = useState([]);
    const [goals, setGoals] = useState([]);
    const [dailyUsage, setDailyUsage] = useState(null);
    const [recommendation, setRecommendation] = useState('');
    const [futureRecommendation, setFutureRecommendation] = useState('');
    const [screenTime, setScreenTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to format time into hours, minutes, and seconds
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    // Function to calculate progress toward a goal
    const calculateGoalProgress = (createdAt, targetDate) => {
        const now = new Date();
        const start = new Date(createdAt);
        const target = new Date(targetDate);

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(target.getTime())) {
            return 0; // Return 0 progress if invalid dates
        }

        const totalDuration = target - start; // Total duration of the goal
        const elapsedTime = now - start; // Time passed since the start
        const progress = Math.min((elapsedTime / totalDuration) * 100, 100); // Clamp progress to 100%
        return progress;
    };

    // Function to track app usage and send it to the backend
    const trackUsage = async (appName, duration) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/usage/track', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appName, duration }),
            });

            if (!response.ok) {
                throw new Error('Failed to track usage');
            }
        } catch (err) {
            console.error('Error tracking usage:', err.message);
        }
    };

    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/usage/dashboard', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const json = await response.json();
            setData(json);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    // Function to fetch weekly usage data
    const fetchWeeklyUsageData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(`http://localhost:5000/api/usage/weekly/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 404) {
                setWeeklyUsage([]);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch weekly usage data');
            }

            const data = await response.json();
            setWeeklyUsage(data);
        } catch (err) {
            console.error('Error fetching weekly usage data:', err);
        }
    };

    // Function to fetch user goals
    const fetchGoals = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/goals/user-goals', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch goals');
            }

            const data = await response.json();
            setGoals(data);
        } catch (err) {
            console.error('Error fetching goals:', err.message);
        }
    };

    // Function to fetch daily usage and predictions
    const handleFetchUsageAndPrediction = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');

            const dailyResponse = await fetchDailyUsage(userId, token);
            const predictionResponse = await triggerPrediction(userId, token);

            if (!dailyResponse || dailyResponse.totalUsageMinutes === 0) {
                setDailyUsage(0);
                setRecommendation('No usage data recorded for today.');
                setFutureRecommendation('No prediction available.');
                return;
            }

            setDailyUsage(dailyResponse.totalUsageMinutes || 0);
            setRecommendation(dailyResponse.recommendation || 'No recommendation available.');
            setFutureRecommendation(predictionResponse.recommendation || 'No prediction available.');
        } catch (err) {
            console.error('Error fetching daily usage and predictions:', err);
        }
    };

    
    // Effect to fetch dashboard, weekly usage, and goals data on load
    useEffect(() => {
        const fetchData = async () => {
            await fetchDashboardData();
            await fetchWeeklyUsageData();
            await fetchGoals();
            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Effect to track screen time while the app is active
    useEffect(() => {
        const appName = 'Dashboard';
        const startTime = Date.now();

        const intervalId = setInterval(() => {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            setScreenTime(duration); // Updates every second
        }, 1000);

        return () => {
            clearInterval(intervalId);
            const duration = Math.floor((Date.now() - startTime) / 1000);
            trackUsage(appName, duration);
        };
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // Chart data and options for App Usage Pie Chart
    const appUsageChartData = {
        labels: data.appUsage.map((item) => item.appName),
        datasets: [
            {
                data: data.appUsage.map((item) => item.totalTime / 60), // Convert to minutes
                backgroundColor: ['#FF4500', '#00FA9A', '#1E90FF', '#FFD700', '#DA70D6'], // Vibrant colors
                hoverBackgroundColor: ['#FF6347', '#3CB371', '#4682B4', '#FFEC8B', '#BA55D3'], // Hover effects
            },
        ],
    };

    const pieChartOptions = {
        plugins: {
            legend: {
                position: 'right', // Position legend to the right
                labels: {
                    boxWidth: 15,
                    padding: 10,
                },
            },
        },
        maintainAspectRatio: false, // Adjust sizing
    };

    // Chart data for Weekly Usage Bar Chart
    const weeklyChartData = {
        labels: weeklyUsage.map((item) => item.day),
        datasets: [
            {
                label: 'Screen Time (minutes)',
                data: weeklyUsage.map((item) => item.totalUsage),
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Vibrant blue
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Dashboard</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Screen Time</Text>
                <Text style={styles.cardValue}>{formatTime(data.totalScreenTime)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Current Screen Time</Text>
                <Text style={styles.cardValue}>{formatTime(screenTime)}</Text>
            </View>
            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>App Usage</Text>
                {data?.appUsage?.length > 0 ? (
                    <View style={{ height: 250 }}>
                        <Pie data={appUsageChartData} options={pieChartOptions} />
                    </View>
                ) : (
                    <Text style={styles.noDataText}>No app usage data available yet.</Text>
                )}
                <Text style={styles.chartNote}>* Data shown in minutes</Text>
            </View>
            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Weekly Usage</Text>
                {weeklyUsage.length === 0 ? (
                    <Text style={styles.noDataText}>
                        No weekly usage data available yet.
                    </Text>
                ) : (
                    <Bar data={weeklyChartData} />
                )}
            </View>
            
            <TouchableOpacity
                style={styles.button}
                onPress={handleFetchUsageAndPrediction}
            >
                <Text style={styles.buttonText}>Fetch Daily Usage & Prediction</Text>
            </TouchableOpacity>
            {dailyUsage !== null && (
                <View style={styles.predictionContainer}>
                    <Text style={styles.predictionText}>
                        Today's Total Usage: {dailyUsage} minutes
                    </Text>
                    <Text style={styles.predictionText}>Recommendation: {recommendation}</Text>
                    <Text style={styles.predictionText}>
                        Future Recommendation: {futureRecommendation}
                    </Text>
                </View>
            )}
            <Text style={styles.sectionTitle}>Goals</Text>
            {goals.length === 0 ? (
                <Text style={styles.noGoalsText}>No goals added</Text>
            ) : (
                <FlatList
                    data={goals}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const progress = calculateGoalProgress(item.createdAt, item.targetTime);
                        return (
                            <View style={styles.goalCard}>
                                <Text style={styles.goalName}>{item.goalName}</Text>
                                <Text>{item.description}</Text>
                                <Text>Target: {new Date(item.targetTime).toLocaleString()}</Text>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                                </View>
                                <Text style={styles.progressText}>
                                    {Math.round(progress)}% Complete
                                </Text>
                            </View>
                        );
                    }}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 20,
    },
    chartContainer: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    predictionContainer: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    predictionText: {
        fontSize: 14,
        marginBottom: 5,
    },
    goalCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    goalName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noGoalsText: {
        fontSize: 14,
        color: '#555',
    },
    noDataText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
        marginTop: 10,
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: '#e0e0df',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 12,
        color: '#555',
        marginTop: 5,
    },
    chartNote: {
        fontSize: 12,
        color: '#7B8794',
        marginTop: 5,
        textAlign: 'center',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 20,
    },
}); 






export default DashboardScreen;
