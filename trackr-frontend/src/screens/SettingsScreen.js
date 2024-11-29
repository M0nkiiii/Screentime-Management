import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../App'; // Adjust the path based on your App.js location

const SettingsScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext); // Access logout function from context

    const handleLogout = async () => {
        try {
            await logout(); // Clear token and update auth state
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Navigate back to login and reset the navigation stack
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Account')}
            >
                <Text style={styles.menuText}>Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('HelpAndSupport')}
            >
                <Text style={styles.menuText}>Help and Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('PrivacyPolicy')}
            >
                <Text style={styles.menuText}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('About')}
            >
                <Text style={styles.menuText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    menuText: {
        fontSize: 18,
        color: '#000000',
    },
    logoutButton: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#ff4d4d',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
