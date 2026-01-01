// src/screens/MemberNumberSetting.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import DecisionButton from '../components/DecisionButton';
import { Header } from '../components/Header';

const NUMBERS = Array.from({ length: 8 }, (_, i) => i + 3);
const screenWidth = Dimensions.get('window').width;

const MemberNumberSetting = () => {
  const navigation = useNavigation();
  const { numberOfPlayers, setNumberOfPlayers, setPlayerNames } = useGame();

  const handleNext = () => {
    // プレイヤー数に応じて空の名前配列を初期化
    setPlayerNames(new Array(numberOfPlayers).fill(''));
    navigation.navigate('MemberNameSetting');
  };


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Header
        title="人数設定"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>プレイ人数を選択してください</Text>

        <View style={styles.gridContainer}>
          {NUMBERS.map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                numberOfPlayers === number && styles.selectedButton
              ]}
              onPress={() => setNumberOfPlayers(number)}
            >
              <Text style={[
                styles.numberText,
                numberOfPlayers === number && styles.selectedText
              ]}>
                {number}人
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <DecisionButton
  onPress={handleNext}
  text="決定"
  fullWidth
/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20
  },
  numberButton: {
    width: screenWidth / 3 - 20,
    aspectRatio: 1.5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedText: {
    color: 'white',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40
  }
});

export default MemberNumberSetting;

