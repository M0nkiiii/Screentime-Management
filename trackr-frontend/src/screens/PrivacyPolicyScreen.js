import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const PrivacyPolicyScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Privacy Policy of TrackR App</Text>

            <Text style={styles.section}>
                This application collects some Personal Data from its Users.
                This document can be printed for reference by using the print command in the settings of any browser.
            </Text>

            <Text style={styles.heading}>Owner and Data Controller</Text>
            <Text style={styles.section}>
                Rabi Thapa Magar
                {'\n'}Galkopakha Margh
                {'\n'}44600 Bagmati
                {'\n'}Nepal
                {'\n'}Data Protection Officer: Slen Yalaya Shrestha
                {'\n'}Contact Email: support.trackr.app
            </Text>

            <Text style={styles.heading}>Data Collection Overview</Text>
            <Text style={styles.subheading}>Types of Personal Data Collected</Text>
            <Text style={styles.section}>
                The application may collect, either directly or through third-party services, the following data:
                {'\n'}• Device logs
                {'\n'}• Device information
                {'\n'}• Usage Data
                {'\n'}• Calendar, Photo Library, and Reminder’s permissions
                {'\n'}• Email address
                {'\n'}• User ID
                {'\n\n'}You can find more detailed information about collected data in the specific sections of this privacy policy or in the notices given before data collecting. It can be supplied by the user directly or gathered throughout the application usage.
            </Text>

            <Text style={styles.subheading}>Mandatory vs. Optional Data</Text>
            <Text style={styles.section}>
                All the data which is being asked by the application is mostly essential. Inability to provide the mandatory data may, therefore, deny the app the opportunity to deliver its services. If optional, users are free to opt out from some data fields without affecting the system’s usability. Still in doubt when it comes to mandatory data.
            </Text>

            <Text style={styles.heading}>How Your Data is Processed</Text>
            <Text style={styles.subheading}>Methods of Processing</Text>
            <Text style={styles.section}>
                The data collected is processed using computers or any IT enabled tools in a secure manner. Processing is strictly aligned with stated purposes and may involve:
                {'\n'}• Application administrators, sales, marketing, or legal teams.
                {'\n'}• Using third-party providers like hosting and cloud computing services.
            </Text>

            <Text style={styles.subheading}>Location of Processing</Text>
            <Text style={styles.section}>
                The information is handled at the business premises, including operating offices and other places where the stakeholders are found. These transfers may be to other countries.
            </Text>

            <Text style={styles.subheading}>Retention Period</Text>
            <Text style={styles.section}>
                The data is kept for as long as required, relevant and useful depending on the given purpose. Legal requirements may present conditions that demand an increased period of data storage.
            </Text>

            <Text style={styles.heading}>Purposes of Data Processing</Text>
            <Text style={styles.section}>
                The data collected serves various purposes, including:
                {'\n'}• Providing and improving services.
                {'\n'}• Legal compliances and enforcement.
                {'\n'}• Detecting malicious activities.
                {'\n'}• Beta testing and analytics.
            </Text>

            <Text style={styles.heading}>Permissions and Device Access</Text>
            <Text style={styles.section}>
                Depending on your device, the app may request permission, such as:
                {'\n'}• Calendar Access: View, add, and remove entries.
                {'\n'}• Reminders Access: Manage entries in the Reminders app.
                {'\n'}• Photo Library Access: Interact with stored images.
            </Text>

            <Text style={styles.heading}>User Rights</Text>
            <Text style={styles.section}>
                Users have the right to:
                {'\n'}• Withdraw Consent
                {'\n'}• Access Data
                {'\n'}• Rectify Data
                {'\n'}• Delete Data
                {'\n'}• Transfer Data
                {'\n'}• Object to Processing
                {'\n'}• Lodge Complaints
            </Text>

            <Text style={styles.heading}>Additional Information</Text>
            <Text style={styles.section}>
                • Legal Obligations: Personal data may be disclosed as required by law.
                {'\n'}• Policy Changes: Changes to this policy will be noticed within the application.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#007BFF' },
    heading: { fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#333' },
    subheading: { fontSize: 16, fontWeight: 'bold', marginTop: 8, color: '#555' },
    section: { fontSize: 14, lineHeight: 20, marginTop: 8, color: '#555' },
});

export default PrivacyPolicyScreen;
