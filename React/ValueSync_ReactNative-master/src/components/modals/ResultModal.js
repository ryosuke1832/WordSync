import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import ModalButton from '../ModalButton';

const screenWidth = Dimensions.get('window').width;


const ResultModal = ({ visible, isAllCorrect, onClose }) => {
  const navigation = useNavigation();
  const { resetGame, resetGameKeepPlayers } = useGame();

  const handleHomeButton = () => {
    resetGame();
    onClose();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Top' }],
    });
  };

  const handleRestartSameMembers = () => {
    resetGameKeepPlayers();
    onClose();
    navigation.reset({
      index: 0,
      routes: [{ name: 'ThemeSelect' }],
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.resultTitle}>
            {isAllCorrect ? '全問正解！' : '残念...'}
          </Text>
          
          <Text style={styles.resultMessage}>
            {isAllCorrect 
              ? 'おめでとうございます！\n素晴らしい成績です！'
              : '次回は全問正解を目指して\nがんばりましょう！'}
          </Text>

          <View style={styles.buttonContainer}>
            <ModalButton
              text="同じメンバーでもう一度"
              onPress={handleRestartSameMembers}
              type="primary"
              style={{ marginBottom: 15 }}
            />
            <ModalButton
              text="Homeに戻る"
              onPress={handleHomeButton}
              type="secondary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: screenWidth * 0.85,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  resultMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  restartButton: {
    backgroundColor: '#2196F3',
  },
  homeButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultModal;