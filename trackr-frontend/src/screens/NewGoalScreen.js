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
    const [goalActionModalVisible, setGoalActionModalVisible] = useState(false);
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);

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

    const markGoalAsCompleted = async (goalId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/goals/mark-completed/${goalId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to mark goal as completed');
            }

            Alert.alert('Success', 'Goal marked as completed!');
            setGoalActionModalVisible(false);
            fetchGoals(); // Refresh goals
        } catch (error) {
            console.error('Error marking goal as completed:', error.message);
            Alert.alert('Error', 'Failed to mark goal as completed. Please try again.');
        }
    };

    const extendGoalDeadline = async (goalId, newTargetTime) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/goals/extend/${goalId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ targetTime: newTargetTime }),
            });

            if (!response.ok) {
                throw new Error('Failed to extend goal deadline');
            }

            Alert.alert('Success', 'Goal deadline extended successfully!');
            setGoalActionModalVisible(false);
            fetchGoals(); // Refresh goals after extending
        } catch (error) {
            console.error('Error extending goal deadline:', error.message);
            Alert.alert('Error', 'Failed to extend goal deadline. Please try again.');
        }
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
                    <TouchableOpacity
                        style={[styles.goalCard, item.completed && styles.goalCardCompleted]}
                        onPress={() => {
                            setSelectedGoal(item);
                            setGoalActionModalVisible(true);
                        }}
                    >
                        <Text style={styles.goalName}>
                            {item.goalName} {item.completed && '✔️'}
                        </Text>
                        <Text style={styles.goalDescription}>{item.description}</Text>
                        <Text style={styles.goalTime}>
                            Target: {new Date(item.targetTime).toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Add Goal Modal */}
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
                                onChange={(date) => setTargetTime(date)}
                                showTimeSelect
                                dateFormat="Pp"
                            />
                        ) : (
                            <DateTimePicker
                                value={targetTime}
                                mode="datetime"
                                display="default"
                                onChange={(event, date) => setTargetTime(date || targetTime)}
                            />
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

            {/* Goal Action Modal */}
            <Modal visible={goalActionModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedGoal?.goalName}</Text>
                        <Text style={styles.goalDescription}>{selectedGoal?.description}</Text>
                        {!selectedGoal?.completed && (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => markGoalAsCompleted(selectedGoal.id)}
                            >
                                <Text style={styles.saveButtonText}>Mark as Achieved</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.saveButtonText}>Extend Deadline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setGoalActionModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Extend Date Picker */}
                {showDatePicker && (
                    <Modal transparent={true} animationType="fade">
                        <View style={styles.modalContainer}>
                            {Platform.OS === 'web' ? (
                                <DatePicker
                                    selected={new Date()}
                                    onChange={(date) => {
                                        setShowDatePicker(false);
                                        extendGoalDeadline(selectedGoal.id, date);
                                    }}
                                    showTimeSelect
                                    dateFormat="Pp"
                                />
                            ) : (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="datetime"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) extendGoalDeadline(selectedGoal.id, date);
                                    }}
                                />
                            )}
                        </View>
                    </Modal>
                )}
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
    goalCardCompleted: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
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
