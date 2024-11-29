import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserInfo, updateUser } from '../config/api';

const AccountScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await fetchUserInfo();
                if (userData) {
                    setUsername(userData.username);
                    setEmail(userData.email);
                    setPhoneNumber(userData.phoneNumber);
                    setProfilePicture(userData.profilePicture);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch user info.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleProfilePictureChange = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to allow access to your media library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const fileInfo = await fetch(result.assets[0].uri);
            const blob = await fileInfo.blob();

            if (blob.size > MAX_IMAGE_SIZE) {
                Alert.alert('Image Too Large', 'Please select an image smaller than 2 MB.');
                return;
            }

            setProfilePicture(result.assets[0].uri);

            if (Platform.OS === 'web') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBase64Image(reader.result); // Convert to Base64
                };
                reader.readAsDataURL(blob);
            } else {
                const base64File = await convertToBase64(result.assets[0].uri);
                setBase64Image(base64File);
            }
        }
    };

    const convertToBase64 = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting to Base64:', error.message);
            return null;
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedData = {
                username,
                phoneNumber,
                profilePicture: base64Image || profilePicture, // Send updated Base64 profile picture or existing URI
            };

            const response = await updateUser(updatedData);
            if (response.success) {
                Alert.alert('Success', 'Your profile has been updated successfully.');
            } else {
                Alert.alert('Error', 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Failed to update user info:', error.message);
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Account</Text> */}
            <Text style={styles.sectionLabel}>Personal Details</Text>
            <TouchableOpacity onPress={handleProfilePictureChange}>
                {profilePicture ? (
                    <Image
                        source={{
                            uri: Platform.OS === 'web'
                                ? profilePicture
                                : `http://localhost:5000${profilePicture}`,
                        }}
                        style={styles.profilePicture}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Text style={styles.changePictureText}>Click to change profile picture</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={username}
                onChangeText={setUsername}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                editable={false} // Make email read-only
            />
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        color: '#555',
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    placeholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    placeholderText: {
        color: '#7d7d7d',
        textAlign: 'center',
    },
    changePictureText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#555',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccountScreen;
