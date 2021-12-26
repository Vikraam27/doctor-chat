import React from 'react';
import {
  Image,
  ImageBackground, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function GetStarted({ navigation }) {
  return (
    <ImageBackground source={require('../../assets/getStartedImg.jpg')} style={styles.imageBackground}>
      <View style={styles.innerContainer}>
        <View>
          <Image source={require('../../assets/chat.png')} />
          <Text style={styles.headingText}>
            Communication with doctors is now easier with docchat
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('signup')} style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('signin')} style={styles.buttonSecondary}>
            <Text style={styles.buttonTextSecondary}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    height: '100%',
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.40)',
    padding: 40,

    justifyContent: 'space-between',
  },
  headingText: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'mali-bold',
  },
  buttonPrimary: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#34CC99',
    marginVertical: 10,
  },
  buttonTextPrimary: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  buttonTextSecondary: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});
