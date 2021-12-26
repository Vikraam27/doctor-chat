import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserInfoContex from '../../helpers/Contex';
import { Input } from '../../component/FormComponent';
import fetchAPI from '../../api';
import Token from '../../helpers/Token';

export default function SigninScreen({ route, navigation }) {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [messages, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async () => {
    if (!username && !password) {
      setMessage('please fill the form !!');
    }
    if (password.length <= 7) {
      setMessage('password must be less than 8');
    }
    if (username && password.length >= 7) {
      const res = await fetchAPI.Signin({ username, password });
      if (res.status === 'success') {
        await Token.Set('accessToken', res.data.accessToken);
        await Token.Set('refreshToken', res.data.refreshToken);
        setUserinfo((prev) => ({
          ...prev,
          refreshToken: res.data.refreshToken,
        }));

        console.log('ga');
        console.log(res);
      }
      if (res.status === 'fail') {
        setMessage(res.message);
      }
    }
  };

  useEffect(() => {
    if (route.params?.message) {
      setMessage(route.params.message);
    }
    console.log(messages);
  }, [messages]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.HeadingText}> Sign In</Text>
        <Image source={require('../../assets/chat.png')} />
        {messages ? (
          <View style={[styles.message, { backgroundColor: messages === 'successfully registered user' ? '#5d925d' : '#c23232' }]}>
            <Text style={{ color: '#fff', fontSize: 15 }}>{messages}</Text>
            <Ionicons onPress={() => setMessage('')} name="close" size={24} color="white" />
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <Input onChangeText={(value) => setUsername(value)} label="Username" placeholder="Enter Your Username" />
          <Input onChangeText={(value) => setPassword(value)} label="Password" placeholder="Password must be at least 8 characters" secureTextEntry />
          <TouchableOpacity onPress={() => submitHandler()} style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Sign in</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center' }}>
            Don&apos;t have account ?
            <Text onPress={() => navigation.navigate('signup')} style={{ color: 'blue' }}>
              {' Sign in'}
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  HeadingText: {
    fontFamily: 'mali-bold',
    fontSize: 50,
    fontWeight: '400',
  },
  inputContainer: {
    flex: 1,
    width: '80%',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 6,
    marginTop: 3,
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
  message: {
    width: '80%',
    flexDirection: 'row',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
