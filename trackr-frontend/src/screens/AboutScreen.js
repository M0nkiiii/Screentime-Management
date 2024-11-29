import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('C:/Users/nepac/OneDrive/Documents/College IIMS/SEM 8/Capstone Project/trackr-frontend/assets/images/logoo.png')}
            />
            <Text style={styles.title}>About TrackR</Text>
            <Text style={styles.text}>
                TrackR is your ultimate task management app. Designed to keep you organized, efficient, and productive.
            </Text>
            <Text style={styles.text}>Version: 1.0.0</Text>
            <Text style={styles.text}>Developed by: TrackR Team</Text>
            <TouchableOpacity style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#f8f9fa' },
    logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, borderWidth: 2, borderColor: '#007BFF' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    text: { fontSize: 16, marginBottom: 10, textAlign: 'center', lineHeight: 24, color: '#555' },
    feedbackButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    feedbackButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AboutScreen;
