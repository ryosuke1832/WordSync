// src/screens/ResultInput.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import DecisionButton from '../components/DecisionButton';
import { Header } from '../components/Header';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const ResultInput = () => {
  const navigation = useNavigation();
  const { selectedTheme, playersData, submitUserAnswer } = useGame();
  const [players, setPlayers] = useState([...playersData]);

  const handleSubmit = () => {
    // 回答を提出して結果ページへ遷移
    submitUserAnswer(players);
    navigation.navigate('ResultPage');
  };

  const renderItem = ({ item, drag, isActive, getIndex }) => {
    const index = getIndex();
    
    return (
      <ScaleDecorator>
        <View
          style={[
            styles.playerCard,
            isActive && styles.draggingCard
          ]}
        >
          <View style={styles.rankNumber}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.name}</Text>
          </View>
          <Icon 
            name="reorder-two" 
            size={24} 
            color="#999"
            onLongPress={drag}
          />
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="順位入力"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.themeSection}>
          <Text style={styles.themeTitle}>テーマ</Text>
          <View style={styles.themeCard}>
            <Text style={styles.themeText}>{selectedTheme?.theme}</Text>
            <Text style={styles.metricText}>{selectedTheme?.evaluation_metric}</Text>
          </View>
        </View>

        <Text style={styles.instruction}>
          長押しでドラッグして順番を入れ替えてください
        </Text>

        <DraggableFlatList
          data={players}
          onDragEnd={({ data }) => setPlayers(data)}
          keyExtractor={item => item.name}
          renderItem={renderItem}
          containerStyle={styles.listContainer}
        />
        <View style={styles.buttonContainer}>
        <DecisionButton
            onPress={handleSubmit}
            text="決定"
            fullWidth
        />
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
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
  instruction: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  draggingCard: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    backgroundColor: '#F8F8F8',
  },
  playerInfo: {
    flex: 1,
    marginRight: 10,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '500',
  },
  playerNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: screenWidth - 40,
    backgroundColor: '#2196F3',
  },
  rankNumber: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  
});

export default ResultInput;