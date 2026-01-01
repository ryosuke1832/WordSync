// src/components/modals/ConfirmThemeModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Dimensions } from 'react-native';
import ModalButton from '../ModalButton';
const screenWidth = Dimensions.get('window').width;
export const ConfirmThemeModal = ({
  visible,
  onClose,
  currentTheme,
  onConfirm
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.confirmModalContent}>
        <Text style={styles.confirmTitle}>このテーマでよろしいですか？</Text>
        <View style={styles.themeCard}>
          <Text style={styles.themeCardText}>{currentTheme?.theme}</Text>
          <Text style={styles.metricText}>{currentTheme?.evaluation_metric}</Text>
        </View>
        <View style={styles.confirmButtons}>
          <ModalButton
            text="キャンセル"
            onPress={onClose}
            type="secondary"
            style={{ flex: 1, marginRight: 8 }}
          />
          <ModalButton
            text="OK"
            onPress={onConfirm}
            type="primary"
            style={{ flex: 1 }}
          />
        </View>
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
  confirmModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeCard: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  themeCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricText: {
    fontSize: 14,
    color: '#666',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});