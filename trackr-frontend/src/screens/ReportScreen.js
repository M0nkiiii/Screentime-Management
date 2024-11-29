import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Install react-native-vector-icons if not installed

export default function ScreenTimeReports() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Screen Time Reports</Text>
      </View>

      {/* Time Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleText}>WEEKLY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
          <Text style={[styles.toggleText, styles.activeText]}>DAILY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleText}>HOURLY</Text>
        </TouchableOpacity>
      </View>

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: (index + 1) * 20, backgroundColor: '#FFA8A8' }]} />
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* App Usage List */}
      <ScrollView style={styles.appList}>
        {[
          { name: 'Instagram', time: '1 hour and 30 min' },
          { name: 'Facebook', time: '1 hour' },
          { name: 'TikTok', time: '40 min' },
          { name: 'Snapchat', time: '40 min' },
          { name: 'WhatsApp', time: '37 min' },
          { name: 'YouTube', time: '30 min' },
          { name: 'Twitter', time: '20 min' },
          { name: 'Games', time: '5 min' },
        ].map((app, index) => (
          <View key={index} style={styles.appRow}>
            <Icon name="circle" size={30} color="black" style={styles.appIcon} /> {/* Replace with app icons */}
            <Text style={styles.appText}>{app.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Icon name="home" size={30} color="gray" />
        <Icon name="calendar" size={30} color="gray" />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <Icon name="bell" size={30} color="gray" />
        <Icon name="cog" size={30} color="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeToggle: {
    backgroundColor: '#A5C9FF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#FFF',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 30,
    borderRadius: 5,
  },
  dayText: {
    marginTop: 5,
    fontSize: 12,
  },
  appList: {
    flex: 1,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  appIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  appText: {
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});