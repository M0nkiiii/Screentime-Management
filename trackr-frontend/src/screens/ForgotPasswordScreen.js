import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen({ navigation, route }) {
    const { isAdmin = false } = route.params || {}; // Default to regular user
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePasswordStrength = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleVerifyEmail = async () => {
        if (!email) {
            window.alert("Error: Please enter your email.");
            return;
        }

        if (!validateEmail(email)) {
            window.alert("Error: Invalid email format. Please enter a valid email address.");
            return;
        }

        try {
            const endpoint = isAdmin
                ? 'http://localhost:5000/api/admin/check-email'
                : 'http://localhost:5000/api/auth/check-email';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.exists) {
                window.alert('Success: Email found! You can now reset your password.');
                setIsEmailVerified(true);
            } else {
                window.alert(`Error: ${data.error || 'Email not found in the database!'}`);
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            window.alert('Error: Could not connect to the server.');
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            window.alert("Error: Please fill in all fields.");
            return;
        }

        if (!validatePasswordStrength(newPassword)) {
            window.alert(
                'Error: Password must be at least 8 characters long and include:\n' +
                '- An uppercase letter\n- A lowercase letter\n- A number\n- A special character (e.g., @, $, !, %).'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            window.alert("Error: Passwords do not match!");
            return;
        }

        try {
            const endpoint = isAdmin
                ? 'http://localhost:5000/api/admin/reset-password'
                : 'http://localhost:5000/api/auth/reset-password';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                window.alert('Success: Password successfully updated! Please log in with your new password.');
                navigation.navigate(isAdmin ? 'AdminLogin' : 'Login');
            } else {
                window.alert(`Error: ${data.error || 'Failed to reset password.'}`);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            window.alert('Error: Could not connect to the server.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <Text style={styles.goBackText}>← Go Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{isAdmin ? 'Admin Forgot Password' : 'Forgot Password'}</Text>

            {!isEmailVerified && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleVerifyEmail}>
                        <Text style={styles.buttonText}>Verify Email</Text>
                    </TouchableOpacity>
                </>
            )}

            {isEmailVerified && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
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
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    goBackButton: { position: 'absolute', top: 40, left: 20, padding: 10 },
    goBackText: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' },
});
