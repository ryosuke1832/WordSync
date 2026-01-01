// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';



import TopPage from '../screens/TopPage';
import ConfirmationNameNumber from '../screens/ConfirmationNameNumber';
import DiscussionPage from '../screens/DiscussionPage';

import MemberNameSetting from '../screens/MemberNameSetting';
import MemberNumberSetting from '../screens/MemberNumberSetting';
import ResultPage from '../screens/ResultPage';
import ResultInput from '../screens/ResultInput';
import ThemeSelect from '../screens/ThemeSelect';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator initialRouteName="Top" screenOptions={{headerShown:false}}>
      <Stack.Screen name="Top" component={TopPage}  />
      <Stack.Screen name="ConfirmationNameNumber" component={ConfirmationNameNumber} />
      <Stack.Screen name="DiscussionPage" component={DiscussionPage} />
      <Stack.Screen name="MemberNameSetting" component={MemberNameSetting} />
      <Stack.Screen name="MemberNumberSetting" component={MemberNumberSetting} />
      <Stack.Screen name="ResultPage" component={ResultPage} />
      <Stack.Screen name="ResultInput" component={ResultInput} />
      <Stack.Screen name="ThemeSelect" component={ThemeSelect} />

    </Stack.Navigator>
);

export default AppNavigator;
