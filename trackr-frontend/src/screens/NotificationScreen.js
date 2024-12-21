import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Fetch notifications for the user
    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/notifications/user-notifications', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch notifications');

            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
            Alert.alert('Error', 'Failed to fetch notifications.');
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/notifications/mark-as-read', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to mark notifications as read');

            fetchNotifications(); // Refresh notifications
            Alert.alert('Success', 'All notifications marked as read!');
        } catch (error) {
            console.error('Error marking notifications as read:', error.message);
            Alert.alert('Error', 'Failed to mark notifications as read.');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Notifications</Text>
                <TouchableOpacity style={styles.markAsReadButton} onPress={markAllAsRead}>
                    <Text style={styles.markAsReadText}>Mark All as Read</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.notificationItem,
                            !item.isRead && styles.unreadNotification,
                        ]}
                        onPress={() => {
                            setSelectedNotification(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <Text style={styles.notificationDescription}>{item.description}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noNotifications}>No notifications available</Text>}
            />

            {modalVisible && (
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.notificationTitle}>{selectedNotification?.title}</Text>
                            <Text style={styles.notificationDescription}>
                                {selectedNotification?.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.markAsReadButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.markAsReadText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    markAsReadButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    markAsReadText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    notificationItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    unreadNotification: {
        borderLeftWidth: 5,
        borderLeftColor: '#007bff',
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    notificationDescription: {
        fontSize: 14,
        color: '#555',
    },
    noNotifications: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
});

export default NotificationScreen;
