import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { GameProvider } from './src/context/GameContext';
import { TypographyProvider } from './src/provider/TypographyProvider';


const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);


  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'NotoSansJP-Regular': require('./assets/fonts/NotoSansJP-Regular.ttf'),
        'NotoSansJP-Medium': require('./assets/fonts/NotoSansJP-Medium.ttf'),
        'NotoSansJP-Bold': require('./assets/fonts/NotoSansJP-Bold.ttf'),
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // またはローディング画面
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
       <TypographyProvider>
        <NavigationContainer >
          <AppNavigator />
        </NavigationContainer>
        </TypographyProvider>
      </GameProvider>
    </SafeAreaProvider>
  );
};

export default App;


