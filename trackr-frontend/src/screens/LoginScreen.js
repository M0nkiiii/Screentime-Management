import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { AuthContext } from '../../App';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            window.alert('Invalid Email: Please enter a valid email address.');
            return;
        }
    
        if (!password) {
            window.alert('Password is required.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Login successful:', data);
    
                // Save token and userId to AsyncStorage (for app)
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('userId', data.userId.toString());
    
                // Log the token to verify it's correct before saving it to chrome.storage.local
                console.log('Saving token to chrome.storage.local:', data.token);
    
                // Save the token in chrome.storage.local for the extension to access
                if (chrome && chrome.storage) {
                    chrome.storage.local.set({ authToken: data.token }, () => {
                        console.log('Token saved to chrome.storage.local:', data.token);
                    });
                }
    
                // Call login context function and navigate to Main
                login(data.token);
                navigation.replace('Main'); // Navigate to the main screen
            } else {
                console.log('Login failed:', data);
                window.alert(data.error || 'Invalid credentials!');
            }
        } catch (error) {
            console.error('Login Error:', error);
            window.alert('Error: Failed to connect to the server!');
        }
    };
    
    
    
    
    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.iconContainer}>
                <Image
                    source={require('C:/Users/nepac/OneDrive/Documents/College IIMS/SEM 8/Capstone Project/trackr-frontend/assets/images/logo.png')} // Replace with your logo path
                    style={styles.logo}
                />
                <Text style={styles.title}>Login</Text> {/* Login Title */}
            </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            {/* Register Option */}
            <Text style={styles.orText}>OR</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}
            >
                <Text style={styles.registerText}>Create New Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword', {isAdmin:false})}
                style={styles.forgotPasswordButton}
            >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Admin Access Button */}
            <View style={styles.adminAccessContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
                    <Text style={styles.adminAccessText}>Admin Login/Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
        marginTop: 10,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        width: '100%',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: {
        marginVertical: 20,
        fontSize: 16,
        color: '#000',
    },
    registerButton: {
        alignItems: 'center',
    },
    registerText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        marginTop: 10,
        alignSelf: 'center',
    },
    forgotPasswordText: {
        color: '#007BFF',
        fontSize: 14,
    },
    adminAccessContainer: {
        position: 'absolute',
        bottom: 20, // Position at the bottom of the screen
        alignSelf: 'center',
    },
    adminAccessText: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
