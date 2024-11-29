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
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const addTask = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/tasks/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskName,
                    description,
                    date: selectedDate.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            // Create notification for the task
            await fetch('http://localhost:5000/api/notifications/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'New Task Added',
                    description: `Task: ${taskName}`,
                }),
            });

            Alert.alert('Success', 'Task added successfully!');
            setModalVisible(false);
            setTaskName('');
            setDescription('');
            fetchTasks(); // Refresh tasks after adding
        } catch (error) {
            console.error('Error adding task:', error.message);
            Alert.alert('Error', 'Failed to add task. Please try again.');
        }
    };

    const fetchTasks = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/tasks/user-tasks', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Calendar</Text>
            <Calendar
                onDayPress={(day) => setSelectedDate(new Date(day.dateString))}
                markedDates={{
                    [selectedDate.toISOString().split('T')[0]]: {
                        selected: true,
                        selectedColor: '#007bff',
                    },
                }}
                style={styles.calendar}
                theme={{
                    selectedDayBackgroundColor: '#007bff',
                    todayTextColor: '#007bff',
                    arrowColor: '#007bff',
                }}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks.filter(
                    (task) =>
                        new Date(task.date).toISOString().split('T')[0] ===
                        selectedDate.toISOString().split('T')[0]
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskCard}>
                        <Text style={styles.taskName}>{item.taskName}</Text>
                        <Text style={styles.taskDescription}>{item.description}</Text>
                    </View>
                )}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Task</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Task Name"
                            value={taskName}
                            onChangeText={setTaskName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                        />

                        {Platform.OS === 'web' ? (
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
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
                                        Select Date: {selectedDate.toLocaleString()}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={selectedDate}
                                        mode="datetime"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) setSelectedDate(date);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        <TouchableOpacity style={styles.saveButton} onPress={addTask}>
                            <Text style={styles.saveButtonText}>Save Task</Text>
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
        backgroundColor: '#fff',
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    calendar: {
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 14,
        color: '#555',
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
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    dateButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#007bff',
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

export default CalendarScreen;
