import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import CustomButton from '../components/CustomButton';
import ResultModal from '../components/modals/ResultModal';
import { Header } from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const CARD_HEIGHT = 80;

const ResultPage = () => {
  const navigation = useNavigation();
  const { userAnswer, correctOrder } = useGame();
  const [checkedIndices, setCheckedIndices] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const scrollViewRef = useRef(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    if (userAnswer && userAnswer.length > 0) {
      startResultAnimation();
    }
  }, [userAnswer]);

  const checkAllAnswersCorrect = () => {
    return userAnswer.every((answer, index) => 
      answer.number === correctOrder[index].number
    );
  };

  useEffect(() => {
    if (animationComplete) {
      const allCorrect = checkAllAnswersCorrect();
      setIsAllCorrect(allCorrect);
      setShowResultModal(true);
    }
  }, [animationComplete]);

  // スクロール位置の監視（下端のみ）
  const handleScroll = (event) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    const maximumScrollPosition = contentHeight - scrollViewHeight;

    // 下端に近づいたかどうかのチェック（余裕を持って50px）
    if (currentScrollPosition >= maximumScrollPosition - 50) {
      setAutoScrollEnabled(false);
    }
  };

  const startResultAnimation = () => {
    userAnswer.forEach((_, index) => {
      setTimeout(() => {
        setCheckedIndices(prev => [...prev, index]);
        
        // 自動スクロールが有効な場合のみスクロール
        if (autoScrollEnabled && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: Math.max(0, (index - 1) * CARD_HEIGHT),
            animated: true
          });
        }
      }, index * 1000);
    });

    setTimeout(() => {
      setShowButton(true);
      setAnimationComplete(true);
    }, userAnswer.length * 1000);
  };

  const isCorrectAnswer = (index) => {
    return userAnswer[index].number === correctOrder[index].number;
  };

  if (!userAnswer || userAnswer.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.noDataText}>データがありません</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ResultModal
        visible={showResultModal}
        isAllCorrect={isAllCorrect}
        onRestartSameMembers={() => {
          setShowResultModal(false);
        }}
        onClose={() => {
          setShowResultModal(false);
        }}
      />
      <Header
        title="結果発表"
        onBack={() => navigation.goBack()}
      />
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(event) => {
          setScrollViewHeight(event.nativeEvent.layout.height);
        }}
        onContentSizeChange={(width, height) => {
          setContentHeight(height);
        }}
      >
        <View style={styles.listContainer}>
          {userAnswer.map((player, index) => {
            const isChecked = checkedIndices.includes(index);
            const correct = isChecked && isCorrectAnswer(index);

            return (
              <Animated.View
                key={player.name}
                style={[
                  styles.playerCard,
                  isChecked && (correct ? styles.correctCard : styles.incorrectCard),
                ]}
              >
                <View style={styles.rankNumber}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.correctNumberContainer}>
                    <Text 
                      style={[
                        styles.correctNumber,
                        !isChecked && styles.hiddenText
                      ]}
                    >
                      あなたの数字: {player.number}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultIcon}>
                  {isChecked && (
                    <Icon 
                      name={correct ? "checkmark-circle" : "close-circle"} 
                      size={24} 
                      color={correct ? "#4CAF50" : "#F44336"}
                    />
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
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
  },
  listContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10, 
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
    height: 85, // 固定の高さを設定
  },

  correctCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  incorrectCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  rankNumber: {
    width: 30,
    height: 30,
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
  playerInfo: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center', // 中央寄せに変更
  },
  playerName: {
    fontSize: 18,
    fontWeight: '500',
  },
  correctNumberContainer: {
    height: 22, // 正解の数字テキストの高さを固定
    justifyContent: 'center',
  },
  correctNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  hiddenText: {
    opacity: 0, // テキストを非表示にするが、スペースは確保
  },
  resultIcon: {
    width: 24,
    height: 24, // アイコンの高さを固定
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default ResultPage;