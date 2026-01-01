// src/components/CustomButton.js
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CustomButton = ({
  text,
  onPress,
  width = screenWidth - 40, // デフォルト値（画面幅 - 40のパディング）
  fontSize = 24, // デフォルトのフォントサイズ
  style, // 追加のスタイルのため
  textStyle, // テキストスタイルのカスタマイズのため
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: width,
        },
        style, // 追加のスタイルをマージ
      ]}
      onPress={onPress}
      activeOpacity={0.7} // タップ時の不透明度
    >
      <Text
        style={[
          styles.buttonText,
          {
            fontSize: fontSize,
          },
          textStyle, // 追加のテキストスタイルをマージ
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8, // 角丸の追加
    elevation: 3, // Androidのシャドウ
    shadowColor: '#000', // iOSのシャドウ
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: '500',
    // Note: React NativeではGoogleフォントの使用には追加のセットアップが必要です
    // デフォルトのシステムフォントを使用
  },
});

export default CustomButton;