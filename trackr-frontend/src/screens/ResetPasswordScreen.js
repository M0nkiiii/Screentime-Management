import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ResetPasswordScreen() {
  const [error, setError] = useState('Invalid Password Reset Token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Icon and Title */}
      <View style={styles.iconContainer}>
        <Icon name="user-circle" size={60} color="#007AFF" />
      </View>
      <Text style={styles.title}>Change your password</Text>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorMessage}>{error}</Text>
      )}

      {/* New Password Field */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#7e7e7e"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm Password Field */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#7e7e7e"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Change Password Button */}
      <TouchableOpacity style={styles.changePasswordButton}>
        <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Create New Account Link */}
      <TouchableOpacity>
        <Text style={styles.createAccountText}>Create New Account</Text>
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity style={styles.backToLoginButton}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#FFF',
  },
  header: {
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    backgroundColor: '#E0E0E0',
    textAlign: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  changePasswordButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  createAccountText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToLoginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
});