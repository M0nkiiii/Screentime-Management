import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('C:/Users/nepac/OneDrive/Documents/College IIMS/SEM 8/Capstone Project/trackr-frontend/assets/images/logoo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>TRACKR</Text>
            </View>

            {/* Blue Wave Section */}
            <View style={styles.bottomWave}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Let’s Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: '20%',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    bottomWave: {
        width: '100%',
        height: '50%',
        backgroundColor: '#007bff',
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
