import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Leaderboard</Text>
      </View>

      {/* Top Player Section */}
      <View style={styles.topPlayerContainer}>
        <Icon name="trophy" size={30} color="gold" />
        <Text style={styles.topPlayerPosition}>1st</Text>
        <Image
          source={{ uri: 'https://placekitten.com/50/50' }} // Replace with actual image URL for top player
          style={styles.topPlayerImage}
        />
        <Text style={styles.topPlayerPoints}>9 Points</Text>
      </View>

      {/* Leaderboard List */}
      <ScrollView style={styles.leaderboardList}>
        {[
          { name: 'Apurva Nepal', points: '9 Points', rank: 1, isTopPlayer: true },
          { name: 'Anmol Pradhan', points: '8 points', rank: 2 },
          { name: 'Subit Timalsina', points: '5 points', rank: 3 },
          { name: 'Anmol Pradhan', points: '5 points', rank: 4 },
          { name: 'Dipshan Pokhrel', points: '4 points', rank: 5 },
        ].map((player, index) => (
          <View key={index} style={styles.playerRow}>
            <Text style={styles.playerRank}>{player.rank}.</Text>
            {player.isTopPlayer ? (
              <Image
                source={{ uri: 'https://placekitten.com/50/50' }} // Replace with actual image URL
                style={styles.playerImage}
              />
            ) : (
              <Icon name="user-circle" size={30} color="black" style={styles.playerImage} />
            )}
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerPoints}>{player.points}</Text>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  topPlayerContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  topPlayerPosition: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  topPlayerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  topPlayerPoints: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  leaderboardList: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerRank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 20,
  },
  playerImage: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  playerName: {
    fontSize: 16,
    flex: 1,
  },
  playerPoints: {
    fontSize: 16,
    fontWeight: 'bold',
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