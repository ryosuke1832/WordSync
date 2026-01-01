// src/components/modals/PlayerConfirmationModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import ModalButton from '../ModalButton';

export const PlayerConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  playerName 
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>確認</Text>
        <Text style={styles.modalText}>
          あなたは"{playerName}"ですか？
        </Text>
        <View style={styles.modalButtons}>
          <ModalButton
            text="いいえ"
            onPress={onClose}
            type="secondary"
            style={{ flex: 1, marginRight: 8 }}
          />
          <ModalButton
            text="はい"
            onPress={onConfirm}
            type="primary"
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export const NumberDisplayModal = ({ 
  visible, 
  onClose, 
  number 
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>あなたの数字</Text>
        <Text style={styles.numberDisplay}>{number}</Text>
        <ModalButton
          text="閉じる"
          onPress={onClose}
          type="primary"
        />
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
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  numberDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    marginVertical: 20,
  },
});