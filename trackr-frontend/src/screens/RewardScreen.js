import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RewardsScreen({ navigation }) {
  const totalPoints = 6;
  const pointsToNextLevel = 9;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your rewards</Text>
        <TouchableOpacity onPress={() => console.log('Search')}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={totalPoints / (totalPoints + pointsToNextLevel)}
          color="#007AFF"
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          Earn {pointsToNextLevel} more points to reach silver
        </Text>
      </View>

      {/* Total Points */}
      <View style={styles.pointsContainer}>
        <Ionicons name="flame" size={24} color="black" />
        <Text style={styles.totalPointsTitle}>Total Points</Text>
        <Text style={styles.pointsText}>You have earned {totalPoints} points</Text>
        <View style={styles.pointIconContainer}>
          <Ionicons name="medal" size={18} color="black" />
          <Text style={styles.pointText}> x {totalPoints}</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => console.log('Home')}>
          <Ionicons name="home-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Calendar')}>
          <Ionicons name="calendar-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Add')} style={styles.addButton}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Notifications')}>
          <Ionicons name="notifications-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Settings')}>
          <Ionicons name="settings-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressBar: {
    width: '80%',
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#888888',
    marginTop: 8,
  },
  pointsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  totalPointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333333',
  },
  pointsText: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 5,
  },
  pointIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pointText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
