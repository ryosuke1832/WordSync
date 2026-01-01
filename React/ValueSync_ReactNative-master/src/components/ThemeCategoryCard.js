// src/components/ThemeCategoryCard.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 6;
const CARD_PADDING = 15;

export const CategoryCard = React.memo(({ category, onPress }) => (
  <View style={{ width: '50%' }}>
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { borderColor: category.color }
      ]}
      onPress={onPress}
    >
      <Icon 
        name={category.icon} 
        size={Math.min(24, screenWidth * 0.06)}
        color={category.color}
      />
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  categoryCard: {
    width: (screenWidth - (CARD_MARGIN * 4 + CARD_PADDING * 4)) / 2,
    margin: CARD_MARGIN,
    padding: CARD_PADDING,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 3,
    aspectRatio: 1.5,
  },
  categoryText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});