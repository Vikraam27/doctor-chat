/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Token from './helpers/Token';
import UserInfoContex from './helpers/Contex';
import MainContainer from './navigation/MainContainer';
import DoctorProfileList from './navigation/screens/DoctorProfileListScreen';
import GetStarted from './navigation/screens/GetStartedScreen';
import SigninScreen from './navigation/screens/SigninScreen';
import SignupScreen from './navigation/screens/SignupScreen';
import DoctorProfile from './navigation/screens/DoctorProfileScreen';
import Chat from './navigation/screens/Chat';

const Stack = createStackNavigator();
function App() {
  const [isFontLoaded, setFontLoaded] = useState(false);
  const [userinfo, setUserinfo] = useState({
    refreshToken: null,
    owner: '',
    participant: '',
    userType: null,
    profileUrl: null,
  });
  async function loadFont() {
    await Font.loadAsync({
      // eslint-disable-next-line quote-props
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'mali-bold': require('./assets/fonts/Mali-Bold.ttf'),
      'mali-regular': require('./assets/fonts/Mali-Regular.ttf'),
    });
    setFontLoaded(true);
  }

  useEffect(async () => {
    loadFont();
    const refToken = await Token.Get('refreshToken');
    setUserinfo((prev) => ({
      ...prev,
      refreshToken: refToken,
    }));
  }, []);

  if (!isFontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }
  return (
    <UserInfoContex.Provider value={[userinfo, setUserinfo]}>
      <NavigationContainer>
        <Stack.Navigator>
          {userinfo.refreshToken == null ? (
            <>
              <Stack.Screen
                name="getStarted"
                component={GetStarted}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="signin"
                component={SigninScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="signup"
                component={SignupScreen}
                options={{
                  headerShown: false,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="home"
                component={MainContainer}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="listDoctor"
                component={DoctorProfileList}
                options={{
                  title: 'Doctors',
                  headerStyle: {
                    backgroundColor: '#112340',
                  },
                  headerTitleStyle: {
                    color: '#fff',
                  },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="DoctorProfile"
                component={DoctorProfile}
                options={{
                  title: 'Doctor Profile',
                  headerStyle: {
                    backgroundColor: '#112340',
                  },
                  headerTitleStyle: {
                    color: '#fff',
                  },
                  headerTitleAlign: 'center',
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="chat"
                component={Chat}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserInfoContex.Provider>
  );
}

export default App;
