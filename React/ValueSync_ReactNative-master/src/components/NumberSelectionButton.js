// src/components/NumberSelectionButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const NumberSelectionButton = ({ number, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected ? styles.selectedButton : styles.unselectedButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          isSelected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {number}人
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  unselectedButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: 'black',
  },
});

export default NumberSelectionButton;