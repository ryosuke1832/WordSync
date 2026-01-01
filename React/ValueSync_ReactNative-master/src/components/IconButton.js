// components/IconButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IconButton = ({ iconName, size = 40, color = "black", onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.iconButton, style]} onPress={onPress}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
  },
});

export default IconButton;