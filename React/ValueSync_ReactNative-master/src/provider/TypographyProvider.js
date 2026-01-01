// src/providers/TypographyProvider.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { typography } from '../theme/typography'

// 日本語判定の関数
const isJapanese = (text) => {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
};

// デフォルトのテキストスタイルを定義
const createTextStyle = (isJp = true) => ({
  fontFamily: isJp ? typography.fonts.regular : typography.fonts.english.regular,
  fontSize: typography.sizes.base,
  lineHeight: typography.sizes.base * typography.lineHeights.normal,
});

// スタイル付きのTextコンポーネント
export const StyledText = ({ children, style, weight = 'regular', ...props }) => {
  const isJp = isJapanese(String(children));
  
  const getFontFamily = () => {
    const fonts = isJp ? typography.fonts : typography.fonts.english;
    switch (weight) {
      case 'bold':
        return fonts.bold;
      case 'medium':
        return fonts.medium;
      default:
        return fonts.regular;
    }
  };

  const defaultStyle = {
    ...createTextStyle(isJp),
    fontFamily: getFontFamily(),
  };

  return (
    <Text style={[defaultStyle, style]} {...props}>
      {children}
    </Text>
  );
};

// プロバイダーコンポーネント
export const TypographyProvider = ({ children }) => {
  const baseStyle = createTextStyle(true);
  
  React.useEffect(() => {
    // Text コンポーネントのデフォルトプロパティを設定
    Text.defaultProps = {
      ...Text.defaultProps,
      style: baseStyle,
    };
  }, []);

  return <>{children}</>;
};