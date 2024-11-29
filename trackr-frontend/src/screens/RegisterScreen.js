import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'react-toastify';


export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // Validates a 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };

  const handlePickImage = async () => {
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
      }
    }
  };

  const handleRegister = async () => {
    // Validate email and phone number
    if (!validateEmail(email)) {
        console.log('Invalid email:', email);
        window.alert('Invalid Email: Please enter a valid email address.');
        return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
        console.log('Invalid phone number:', phoneNumber);
        window.alert('Invalid Phone Number: Phone number must be a 10-digit number.');
        return;
    }

    // Payload for registration
    const payload = {
        username,
        email,
        password,
        phoneNumber,
        profilePicture: base64Image,
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
            // Navigate to the Login page immediately after successful registration
            navigation.navigate('Login');
        } else {
            // Show an error popup if registration fails
            window.alert(`Error: ${data.error || 'Failed to register!'}`);
        }
    } catch (error) {
        window.alert('Error: Failed to connect to the server!');
        console.error('Registration Error:', error);
    }
};


  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.iconContainer}>
        <Image
          source={require('C:/Users/nepac/OneDrive/Documents/College IIMS/SEM 8/Capstone Project/trackr-frontend/assets/images/logo.png')} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.title}>Register</Text>
      </View>

      {/* Profile Picture Picker */}
      <TouchableOpacity onPress={handlePickImage} style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Select Profile Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Login Option */}
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF', // Blue color for the title
    marginTop: 10,
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageText: {
    color: '#777',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 20,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    alignItems: 'center',
  },
  loginText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
