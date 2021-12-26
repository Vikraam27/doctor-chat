import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatListScreen from './screens/ChatListScreen';

// Screen names
const homeName = 'Home';
const profileName = 'Profile';
const chatListName = 'ChatList';

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === chatListName) {
            iconName = focused ? 'ios-chatbox-ellipses' : 'ios-chatbox-ellipses-outline';
          } else if (rn === profileName) {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#34CC99',
        tabBarInactiveTintColor: 'gray',
        showIcon: true,
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: [
          styles.tabBar,
          null,
        ],
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
      tab
    >

      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={chatListName} component={ChatListScreen} />
      <Tab.Screen name={profileName} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    padding: 10,
    height: 60,
    backgroundColor: '#112340',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default MainContainer;
