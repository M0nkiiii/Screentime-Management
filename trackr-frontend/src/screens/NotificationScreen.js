import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

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

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
      setHasNewNotifications(data.some((notif) => !notif.isRead));
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      Alert.alert('Error', 'Failed to fetch notifications.');
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications/mark-as-read', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      fetchNotifications();
      setHasNewNotifications(false);
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
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {hasNewNotifications ? 'You have new notifications' : 'All notifications are read'}
        </Text>
        <TouchableOpacity onPress={markNotificationsAsRead} style={styles.markAsReadButton}>
          <Text style={styles.markAsReadText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noNotifications}>No notifications available</Text>
        }
      />
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
});

export default NotificationScreen;
