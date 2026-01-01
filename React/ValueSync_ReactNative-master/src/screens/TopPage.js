import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../components/IconButton';
import StartButton from '../components/StartButton';
import ManualModal from '../components/modals/ManualModal';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const TopPage = () => {
  const navigation = useNavigation();
  const [manualVisible, setManualVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#7F7FD5', '#86A8E7', '#91EAE4']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            iconName="help-circle-outline"
            size={32}
            color="white"
            onPress={() => setManualVisible(true)}
          />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="analytics-outline" size={48} color="#7F7FD5" />
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>ValueSync</Text>
            <Text style={styles.subtitle}>
              言葉で表現し、価値を同期させよう
            </Text>
          </View>

          {/* Start Button Area */}
          <View style={styles.startButtonContainer}>
            <StartButton 
              onPress={() => navigation.navigate('MemberNumberSetting')} 
              style={styles.startButton}
            />
            <Text style={styles.startHint}>タップしてゲームを開始</Text>
          </View>
        </View>

        {/* Manual Modal */}
        <ManualModal 
          visible={manualVisible}
          onClose={() => setManualVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
    letterSpacing: 1,
  },
  startButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  startHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
    fontSize: 14,
  },
});

export default TopPage;