import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { AuthContext } from '../../App';

export default function AdminLoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAdminLogin = async () => {
        if (!validateEmail(email)) {
            window.alert('Invalid Email: Please enter a valid email address.');
            return;
        }

        if (!password) {
            window.alert('Invalid Input: Password is required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('adminToken', data.token);
                login(data.token, true); // isAdmin = true
                navigation.replace('AdminDashboard');
            } else {
                window.alert(`Login Failed: ${data.error || 'Invalid credentials.'}`);
            }
        } catch (error) {
            console.error('Login Error:', error);
            window.alert('Error: Failed to connect to the server.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <Text style={styles.goBackText}>← Go Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Admin Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Admin Email"
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
            <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AdminRegister')}>
                <Text style={styles.registerText}>Create Admin Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword', { isAdmin: true })}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, padding: 10 },
    button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    registerText: { color: '#007BFF', marginTop: 10, textAlign: 'center' },
    forgotPasswordText: { color: '#007BFF', marginTop: 10, textAlign: 'center' },
    goBackButton: { position: 'absolute', top: 40, left: 20, padding: 10 },
    goBackText: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' },
});
