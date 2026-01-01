// src/screens/MemberNameSetting.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import DecisionButton from '../components/DecisionButton';
import { Header } from '../components/Header';

const screenWidth = Dimensions.get('window').width;

const MemberNameSetting = () => {
  const navigation = useNavigation();
  const { playerNames, setPlayerNames } = useGame();

  // コンポーネントマウント時にデフォルト名を設定
  useEffect(() => {
    const defaultNames = playerNames.map((name, index) => 
      name.trim() === '' ? `ユーザー${index + 1}` : name
    );
    setPlayerNames(defaultNames);
  }, []);


      // 名前の更新処理
  const handleNameChange = (index, newName) => {
    const newNames = [...playerNames];
    // 空文字の場合はデフォルト名を設定
    newNames[index] = newName.trim() === '' ? `ユーザー${index + 1}` : newName;
    setPlayerNames(newNames);
  };


  // 決定ボタンの処理
  const handleSubmit = () => {
    // 最終確認として、空の名前をデフォルト名に置き換え
    const finalNames = playerNames.map((name, index) => 
      name.trim() === '' ? `ユーザー${index + 1}` : name
    );
    setPlayerNames(finalNames);
    navigation.navigate('ThemeSelect');
  };




  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="名前設定"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>プレイヤーの名前を入力してください</Text>

        {/* 名前入力フォーム */}
        {playerNames.map((name, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.labelText}>プレイヤー {index + 1}</Text>
            <TextInput
              style={styles.input}
              value={name === `ユーザー${index + 1}` ? '' : name}
              onChangeText={(text) => handleNameChange(index, text)}
              placeholder={`ユーザー${index + 1}`}
              maxLength={20}
              onBlur={() => {
                if (!playerNames[index] || playerNames[index].trim() === '') {
                  handleNameChange(index, `ユーザー${index + 1}`);
                }
              }}
            />
          </View>
        ))}

<DecisionButton
  onPress={handleSubmit}
  text="決定"
  fullWidth
/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  button: {
    width: screenWidth - 40,
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButtonText: {
    color: '#757575',
  },
});

export default MemberNameSetting;


