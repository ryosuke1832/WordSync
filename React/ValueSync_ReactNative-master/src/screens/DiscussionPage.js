import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import CustomButton from '../components/CustomButton';
import DecisionButton from '../components/DecisionButton';

import { Header } from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DiscussionPage = () => {
  const navigation = useNavigation();
  const { selectedTheme } = useGame();
  
  const [showEndModal, setShowEndModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const startTimer = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setShowEndModal(true); // タイマー終了時にモーダルを表示
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

    // 終了モーダルコンポーネント
  const EndModal = () => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={showEndModal}
        onRequestClose={() => setShowEndModal(false)}
    >
        <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>議論終了</Text>
            <Text style={styles.modalText}>結果の入力に進みましょう</Text>

                <View style={styles.buttonContainer}>
  <DecisionButton
            onPress={() => {
                setShowEndModal(false);
                navigation.navigate('ResultInput');
            }}
    text="結果を入力する"
    fullWidth
  />
</View>

        </View>
        </View>
    </Modal>
    );

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(180);
  };

  const adjustTime = (minutes) => {
    if (!isRunning) {
      setTimeLeft(prevTime => {
        const newTime = prevTime + (minutes * 60);
        return Math.min(Math.max(newTime, 0), 59 * 60);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="ディスカッション"
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

        <View style={styles.timerSection}>
          {/* タイマー表示 */}
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {minutes}
            </Text>
            <Text style={styles.timerSeparator}>:</Text>
            <Text style={styles.timerText}>
              {seconds}
            </Text>
          </View>

          {/* 時間調整ボタン */}
          <View style={styles.timeAdjustContainer}>
            <TouchableOpacity 
              style={[styles.adjustButton, isRunning && styles.disabledButton]}
              onPress={() => adjustTime(-1)}
              disabled={isRunning}
            >
              <Icon 
                name="remove-circle" 
                size={40} 
                color={isRunning ? "#BDBDBD" : "#2196F3"} 
              />
              <Text style={[styles.adjustButtonText, isRunning && styles.disabledText]}>
                -1分
              </Text>
            </TouchableOpacity>

            {/* 再生/停止とリセットボタン */}
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.timerButton, styles.resetButton]}
                onPress={resetTimer}
              >
                <Icon name="refresh" size={36} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, styles.mainTimerButton]}
                onPress={isRunning ? stopTimer : startTimer}
              >
                <Icon 
                  name={isRunning ? "pause" : "play"} 
                  size={48} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.adjustButton, isRunning && styles.disabledButton]}
              onPress={() => adjustTime(1)}
              disabled={isRunning}
            >
              <Icon 
                name="add-circle" 
                size={40} 
                color={isRunning ? "#BDBDBD" : "#2196F3"} 
              />
              <Text style={[styles.adjustButtonText, isRunning && styles.disabledText]}>
                +1分
              </Text>
            </TouchableOpacity>
          </View>
        </View>



        <View style={styles.buttonContainer}>
        <DecisionButton
                    onPress={() => navigation.navigate('ResultInput')}
            text="結果を入力する"
            fullWidth
        />
        </View>
        <EndModal />
      </ScrollView>
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
  timerSection: {
    height: screenHeight * 0.35,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#2196F3',
    borderRadius: 30,
    padding: 20,
    backgroundColor: '#F8F9FA',
    elevation: 4,
    minWidth: screenWidth * 0.7,
    marginBottom: 20,
  },
  timeAdjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 100,
    textAlign: 'center',
  },
  timerSeparator: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2196F3',
    marginHorizontal: 10,
  },
  adjustButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 80,
  },
  adjustButtonText: {
    color: '#2196F3',
    fontSize: 24,
    marginTop: 8,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#BDBDBD',
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  timerButton: {
    padding: 15,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 70,
    height: 70,
  },
  mainTimerButton: {
    backgroundColor: '#2196F3',
    width: 90,
    height: 90,
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    width: screenWidth - 40,
    backgroundColor: '#2196F3',
  },

    // モーダル関連のスタイルを追加
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
        elevation: 5,
        width: '80%',
        maxWidth: 400,
      },
      modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 15,
      },
      modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 25,
        color: '#333',
        lineHeight: 24,
      },
      modalButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        elevation: 2,
        width: '100%',
      },
      modalButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
    
    export default DiscussionPage;