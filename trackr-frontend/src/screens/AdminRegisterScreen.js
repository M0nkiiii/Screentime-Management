import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function AdminRegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePasswordStrength = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleAdminRegister = async () => {
        if (!username || !email || !password) {
            window.alert('Invalid Input: All fields are required.');
            return;
        }

        if (!validateEmail(email)) {
            window.alert('Invalid Email: Please enter a valid email address.');
            return;
        }

        if (!validatePasswordStrength(password)) {
            window.alert(
                'Weak Password: Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
            );
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                window.alert('Success: Admin registered successfully!');
                navigation.navigate('AdminLogin');
            } else {
                window.alert(`Error: ${data.error || 'Failed to register admin!'}`);
            }
        } catch (error) {
            console.error('Admin Registration Error:', error);
            window.alert('Error: Failed to connect to the server.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <Text style={styles.goBackText}>← Go Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Admin Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
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
            <TouchableOpacity style={styles.button} onPress={handleAdminRegister}>
                <Text style={styles.buttonText}>Register</Text>
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
    goBackButton: { position: 'absolute', top: 40, left: 20, padding: 10 },
    goBackText: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' },
});
