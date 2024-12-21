import React, { useState, useEffect, createContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './src/navigation/Navigation'; // Make sure this path is correct

export const AuthContext = createContext();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // For normal user
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);  // For admin user

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const userToken = await AsyncStorage.getItem('token');
                const adminToken = await AsyncStorage.getItem('adminToken');
                setIsAuthenticated(!!userToken);  // Check if normal user is authenticated
                setIsAdminAuthenticated(!!adminToken);  // Check if admin is authenticated
            } catch (error) {
                console.error('Error checking token:', error.message);
                setIsAuthenticated(false);
                setIsAdminAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (token, isAdmin = false) => {
        if (isAdmin) {
            await AsyncStorage.setItem('adminToken', token);
            setIsAdminAuthenticated(true);
        } else {
            await AsyncStorage.setItem('token', token);
            setIsAuthenticated(true);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setIsAdminAuthenticated(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdminAuthenticated, login, logout }}>
            <Navigation />
        </AuthContext.Provider>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
