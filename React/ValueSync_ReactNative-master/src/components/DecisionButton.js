import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const DecisionButton = ({
  onPress,
  disabled = false,
  text = "決定",
  variant = "primary",
  fullWidth = true,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return styles.disabledButton;
    }
    return variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  };

  const getTextStyle = () => {
    if (disabled) {
      return styles.disabledText;
    }
    return variant === "primary" ? styles.primaryText : styles.secondaryText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.baseText, getTextStyle(), textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  fullWidth: {
    width: screenWidth - 40,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  baseText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
});

export default DecisionButton;