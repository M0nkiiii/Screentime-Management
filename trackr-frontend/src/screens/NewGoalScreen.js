import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-datepicker'; // For web platform
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for web date picker
import DateTimePicker from '@react-native-community/datetimepicker'; // For mobile

const NewGoalScreen = () => {
    const [goalName, setGoalName] = useState('');
    const [description, setDescription] = useState('');
    const [targetTime, setTargetTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [goals, setGoals] = useState([]);

    const addGoal = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/goals/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    goalName,
                    description,
                    targetTime,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add goal');
            }

            // Create notification for the goal
            await fetch('http://localhost:5000/api/notifications/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'New Goal Added',
                    description: `Goal: ${goalName}`,
                }),
            });

            Alert.alert('Success', 'Goal added successfully!');
            setModalVisible(false);
            setGoalName('');
            setDescription('');
            fetchGoals(); // Refresh goals after adding
        } catch (error) {
            console.error('Error adding goal:', error.message);
            Alert.alert('Error', 'Failed to add goal. Please try again.');
        }
    };

    const fetchGoals = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/goals/user-goals', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch goals');
            }

            const data = await response.json();
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals:', error.message);
        }
    };

    const handleDateChange = (date) => {
        setTargetTime(date);
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Goals</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Goal</Text>
            </TouchableOpacity>

            <FlatList
                data={goals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.goalCard}>
                        <Text style={styles.goalName}>{item.goalName}</Text>
                        <Text style={styles.goalDescription}>{item.description}</Text>
                        <Text style={styles.goalTime}>
                            Target: {new Date(item.targetTime).toLocaleString()}
                        </Text>
                    </View>
                )}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Goal</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Goal Name"
                            value={goalName}
                            onChangeText={setGoalName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                        />

                        {Platform.OS === 'web' ? (
                            <DatePicker
                                selected={targetTime}
                                onChange={handleDateChange}
                                showTimeSelect
                                dateFormat="Pp"
                            />
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.dateButtonText}>
                                        Set Target Time: {targetTime.toLocaleString()}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={targetTime}
                                        mode="datetime"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) setTargetTime(date);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        <TouchableOpacity style={styles.saveButton} onPress={addGoal}>
                            <Text style={styles.saveButtonText}>Save Goal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    goalCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    goalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
    },
    goalDescription: {
        fontSize: 14,
        color: '#6c757d',
        marginVertical: 5,
    },
    goalTime: {
        fontSize: 12,
        color: '#868e96',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    dateButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    dateButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NewGoalScreen;