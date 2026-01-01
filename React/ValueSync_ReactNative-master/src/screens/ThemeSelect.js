// src/screens/ThemeSelect.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DecisionButton from '../components/DecisionButton';
import { useGame } from '../context/GameContext';
import { Header } from '../components/Header';
import { ThemeListModal } from '../components/modals/ThemeListModal';
import { ConfirmThemeModal } from '../components/modals/ConfirmThemeModal';
import { CategoryCard } from '../components/ThemeCategoryCard';
import { CustomThemeInput } from '../components/CustomThemeInput';
import themes from '../assets/data/themes.json';
import { CATEGORIES } from '../constants/themeCategories';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ThemeSelect = () => {
  const navigation = useNavigation();
  const { setSelectedTheme } = useGame();
  const [themeListModalVisible, setThemeListModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [localState, setLocalState] = useState({
    themeText: '',
    metricText: '1:低い-100:高い'
  });

  const handleThemeChange = useCallback((text) => {
    setLocalState(prev => ({ ...prev, themeText: text }));
  }, []);

  const handleMetricChange = useCallback((text) => {
    setLocalState(prev => ({ ...prev, metricText: text }));
  }, []);

  const handleRandomSelect = () => {
    const allThemes = Object.values(themes).flat();
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    setCurrentTheme(randomTheme);
    setConfirmModalVisible(true);
  };

  const handleCustomThemeSubmit = () => {
    if (localState.themeText.trim()) {
      const newTheme = {
        number: "custom",
        theme: localState.themeText.trim(),
        evaluation_metric: localState.metricText.trim(),
      };
      setCurrentTheme(newTheme);
      setConfirmModalVisible(true);
    }
  };

  const handleConfirmTheme = () => {
    setSelectedTheme(currentTheme);
    setConfirmModalVisible(false);
    setThemeListModalVisible(false);
    navigation.navigate('ConfirmationNameNumber');
  };

  const handleThemeSelect = (theme) => {
    setCurrentTheme(theme);
    setThemeListModalVisible(false);
    setConfirmModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="テーマ設定"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          enabled
        >
          <ScrollView 
            style={styles.scrollView}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Text style={styles.sectionTitle}>
                ランダムでテーマを決める
              </Text>
              <DecisionButton
                onPress={handleRandomSelect}
                text="ランダム選択"
                fullWidth
              />
  
              <Text style={styles.sectionTitle}>
                カテゴリーから選ぶ
              </Text>
              <View style={styles.categoriesContainer}>
                {Object.values(CATEGORIES).map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category}
                    onPress={() => {
                      setSelectedCategory(category);
                      setThemeListModalVisible(true);
                    }}
                  />
                ))}
              </View>
  
              <CustomThemeInput
                themeText={localState.themeText}
                metricText={localState.metricText}
                onThemeChange={handleThemeChange}
                onMetricChange={handleMetricChange}
                onSubmit={handleCustomThemeSubmit}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
  
        <ThemeListModal
          visible={themeListModalVisible}
          onClose={() => setThemeListModalVisible(false)}
          selectedCategory={selectedCategory}
          themes={themes}
          onThemeSelect={handleThemeSelect}
        />
        
        <ConfirmThemeModal
          visible={confirmModalVisible}
          onClose={() => setConfirmModalVisible(false)}
          currentTheme={currentTheme}
          onConfirm={handleConfirmTheme}
        />
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    content: {
      flex: 1,
      paddingBottom: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: screenHeight * 0.02,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    }
  });
  
  export default ThemeSelect;