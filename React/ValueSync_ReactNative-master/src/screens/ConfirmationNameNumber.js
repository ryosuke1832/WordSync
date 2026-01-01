// src/screens/ConfirmationNameNumber.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { useNavigation } from '@react-navigation/native';
import DecisionButton from '../components/DecisionButton';
import { Header } from '../components/Header';
import { 
  PlayerConfirmationModal, 
  NumberDisplayModal 
} from '../components/modals/PlayerConfirmationModal';

const screenWidth = Dimensions.get('window').width;

const ConfirmationNameNumber = () => {
  const navigation = useNavigation();
  const { playerNames, selectedTheme, assignNumbersToPlayers, playersData } = useGame();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    console.log('Assigning numbers to players');
    assignNumbersToPlayers();
  }, []);

  const handlePlayerNamePress = (player) => {
    setSelectedPlayer(player);
    setConfirmationModalVisible(true);
  };

  const handleConfirmYes = () => {
    setConfirmationModalVisible(false);
    setModalVisible(true);
  };

  const handleNext = () => {
    navigation.navigate('DiscussionPage');
  };

  const renderPlayersList = () => {
    if (!playersData || playersData.length === 0) {
      return (
        <Text style={styles.noPlayersText}>
          プレイヤーが設定されていません
        </Text>
      );
    }

    return (
      <View style={styles.playersSection}>
        {playersData.map((player, index) => (
          <TouchableOpacity
            key={index}
            style={styles.playerCard}
            onPress={() => handlePlayerNamePress(player)}
          >
            <Text style={styles.playerNumber}>{index + 1}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.tapInstruction}>タップして数字を確認</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="確認"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.themeSection}>
          <Text style={styles.themeTitle}>テーマ</Text>
          <View style={styles.themeCard}>
            <Text style={styles.themeText}>{selectedTheme.theme}</Text>
            <Text style={styles.metricText}>{selectedTheme.evaluation_metric}</Text>
          </View>
        </View>

        <Text style={styles.confirmMessage}>
          ひとりずつ番号を確認してください
        </Text>

        {renderPlayersList()}

        <View style={styles.buttonContainer}>
          <DecisionButton
            onPress={handleNext}
            text="次へ"
            fullWidth
          />
        </View>
      </ScrollView>

      <PlayerConfirmationModal
        visible={confirmationModalVisible}
        onClose={() => setConfirmationModalVisible(false)}
        onConfirm={handleConfirmYes}
        playerName={selectedPlayer?.name}
      />

      <NumberDisplayModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        number={selectedPlayer?.number}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  themeSection: {
    marginBottom: 30,
  },
  themeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  themeCard: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  themeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricText: {
    fontSize: 16,
    color: '#666',
  },
  confirmMessage: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  playersSection: {
    gap: 15,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  playerNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 15,
    color: '#2196F3',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  tapInstruction: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto',
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  noPlayersText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default ConfirmationNameNumber;