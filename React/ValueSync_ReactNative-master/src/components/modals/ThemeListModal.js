// src/components/modals/ThemeListModal.js
import React from 'react';
import { Modal, View, TouchableOpacity, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalButton from '../ModalButton';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const ThemeListModal = ({
  visible,
  onClose,
  selectedCategory,
  themes,
  onThemeSelect
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{selectedCategory?.name}</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScrollView}>
          {themes[selectedCategory?.id]?.map((theme) => (
            <TouchableOpacity
              key={theme.number}
              style={styles.themeListItem}
              onPress={() => onThemeSelect(theme)}
            >
              <Text style={styles.themeListItemText}>{theme.theme}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative', 
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
    position: 'absolute',
    right: 0,
  },
  modalScrollView: {
    maxHeight: screenHeight * 0.5,
  },
  themeListItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  themeListItemText: {
    fontSize: 16,
  },
});