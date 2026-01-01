// src/components/CustomThemeInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import DecisionButton from './DecisionButton';

const ThemeInputField = React.memo(({ value, onChangeText, placeholder }) => {
  return (
    <TextInput
      style={styles.themeInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      maxLength={50}
      autoCorrect={false}
      multiline={false}
      returnKeyType="done"
      blurOnSubmit={false}
      autoCapitalize="none"
      onEndEditing={(e) => e.preventDefault()}
      onSubmitEditing={(e) => e.preventDefault()}
    />
  );
}, (prevProps, nextProps) => prevProps.value === nextProps.value);

export const CustomThemeInput = ({
  themeText,
  metricText,
  onThemeChange,
  onMetricChange,
  onSubmit
}) => (
  <View style={styles.customThemeSection}>
    <Text style={styles.sectionTitle}>
      自分でテーマを設定する
    </Text>
    <View style={styles.inputContainer}>
      <ThemeInputField
        value={themeText}
        onChangeText={onThemeChange}
        placeholder="テーマを入力してください"
      />
      <ThemeInputField
        value={metricText}
        onChangeText={onMetricChange}
        placeholder="評価基準を入力 (例: 1:低い-100:高い)"
      />
      <DecisionButton
        onPress={onSubmit}
        disabled={!themeText.trim()}
        text="テーマを設定"
        variant="secondary"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  customThemeSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  inputContainer: {
    gap: 10,
  },
  themeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'center',
    height: 50,
    includeFontPadding: false,
  },
});