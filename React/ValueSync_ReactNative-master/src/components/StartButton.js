// components/StartButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const buttonSize = Math.min(width * 0.45, 180); // レスポンシブなサイズ設定

const StartButton = ({ onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.startButton, style]} 
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.buttonContent}>
        <Icon 
          name="play" 
          size={32} 
          color="#7F7FD5"
          style={styles.icon}
        />
        <Text style={styles.startButtonText}>
          Play
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  startButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7F7FD5',
    letterSpacing: 1,
  },
});

export default StartButton;