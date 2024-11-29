import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyAndSecurityScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Privacy and Security</Text>
            <Text style={styles.text}>
                Your data's security is our top priority. TrackR uses advanced encryption and secure servers to protect your data.
            </Text>
            <Text style={styles.sectionTitle}>Features:</Text>
            <Text style={styles.text}>• End-to-End Encryption</Text>
            <Text style={styles.text}>• Two-Factor Authentication</Text>
            <Text style={styles.text}>• Secure Cloud Storage</Text>
            <Text style={styles.text}>• Regular Security Updates</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    sectionTitle: { fontSize: 20, marginTop: 20, fontWeight: '600' },
    text: { fontSize: 16, marginBottom: 10, lineHeight: 24 },
});

export default PrivacyAndSecurityScreen;
