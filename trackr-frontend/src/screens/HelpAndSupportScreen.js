import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HelpAndSupportScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Help and Support</Text>
            <Text style={styles.text}>
                Need assistance? Reach out to us through our support channels or check the FAQs below.
            </Text>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.contactText}>Email: support@trackr.app</Text>
            <Text style={styles.contactText}>Phone: +977-123-456789</Text>

            <Text style={styles.sectionTitle}>FAQs</Text>
            <ScrollView style={styles.faqContainer}>
                <Text style={styles.faqText}>• How to reset my password?</Text>
                <Text style={styles.faqText}>• How to change my profile picture?</Text>
            </ScrollView>

            <TouchableOpacity style={styles.supportButton}>
                <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#007BFF' },
    sectionTitle: { fontSize: 20, marginTop: 20, fontWeight: '600', color: '#333' },
    text: { fontSize: 16, marginBottom: 20, lineHeight: 24, color: '#555' },
    contactText: { fontSize: 16, marginBottom: 10, color: '#007BFF' },
    faqContainer: { marginTop: 10 },
    faqText: { fontSize: 16, marginBottom: 10, color: '#555' },
    supportButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    supportButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default HelpAndSupportScreen;
