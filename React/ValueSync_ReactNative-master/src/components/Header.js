import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ManualModal from './modals/ManualModal';

export const Header = ({ title, onBack }) => {
  const insets = useSafeAreaInsets();
  const [showManual, setShowManual] = useState(false);

  return (
    <>
      <View style={[
        styles.header,
        {
          paddingTop: insets.top,
          marginBottom: 10,
        }
      ]}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          onPress={() => setShowManual(true)}
          style={styles.helpButton}
        >
          <Icon name="help-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <ManualModal
        visible={showManual}
        onClose={() => setShowManual(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    marginLeft: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  helpButton: {
    padding: 8,
  },
});

export default Header;