import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
      

      {/* Instructions */}
      <Text style={styles.instructions}>
        Enter your email address or username to reset password.
      </Text>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Email Address or Username"
        placeholderTextColor="#B0B0B0"
      />

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Can't reset password text */}
      <Text style={styles.linkText}>Can't reset your password?</Text>

      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Create New Account</Text>
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15, // Reduced horizontal padding
  },
  iconContainer: {
    marginBottom: 15, // Reduced bottom margin
    alignItems: 'center',
  },
  icon: {
    width: 50, // Smaller icon size
    height: 50,
    borderRadius: 25, // Half of the new width and height
    backgroundColor: '#007AFF',
  },
  instructions: {
    fontSize: 14, // Smaller text size
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20, // Reduced margin
    marginTop: 20,
  },

  input: {
    width: '75%', // Reduced width for smaller input box
    height: 45, // Reduced height
    borderColor: '#B0B0B0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12, // Reduced padding
    marginBottom: 15, // Reduced margin
    backgroundColor: '#F0F0F0',
  },
  button: {
    width: '75%', // Reduced width for buttons
    height: 45, // Reduced button height
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8, // Reduced vertical margin
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14, // Smaller text size
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 12, // Smaller text size for link
    marginVertical: 8, // Reduced margin
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8, // Reduced margin
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#B0B0B0',
  },
  orText: {
    marginHorizontal: 8, // Reduced horizontal margin
    color: '#333333',
    fontSize: 12, // Smaller font size
    
  },
  backButton: {
    width: '90%', // Reduced width
    height: 45, // Reduced height
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100, // Reduced top margin
  },
});