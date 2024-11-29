// TestScreen.js
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TestScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Test Screen</Text>
      <Button
        title="Go to Calendar Screen"
        onPress={() => navigation.navigate('Calendar')}
      />
      <Button
        title="Go to Dashboard Screen"
        onPress={() => navigation.navigate('Dashboard')}
      />
      <Button
        title="Go to Leadership Screen"
        onPress={() => navigation.navigate('Leadership')}
      />
      <Button
        title="Go to Notification Screen"
        onPress={() => navigation.navigate('Notification')}
      />
      <Button
        title="Go to Report Screen"
        onPress={() => navigation.navigate('Report')}
      />
      <Button
        title="Go to Reward Screen"
        onPress={() => navigation.navigate('Reward')}
      />
      <Button
        title="Go to Setting Screen"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default TestScreen;
