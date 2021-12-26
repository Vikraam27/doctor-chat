/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, StatusBar, ScrollView, TextInput, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import fetchAPI from '../../api';
import ChatCard from '../../component/chatCard';
import UserInfoContex from '../../helpers/Contex';
import Token from '../../helpers/Token';

export default function ChatListScreen({ navigation }) {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [chatData, setChatData] = useState(null);
  const [query, setQuery] = useState('');

  const search = (rows) => rows.filter((item) => {
    if (userinfo.owner === item.creator) {
      return item.participant.toLowerCase().includes(query.toLowerCase());
    }
    return item.creator.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    const willFocus = navigation.addListener('focus', async () => {
      const accToken = await Token.Get('accessToken');
      const { data } = await fetchAPI.GetRoomsChat(accToken, userinfo.refreshToken);
      setChatData(data);
    });

    return willFocus;
  }, []);

  if (!chatData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <View style={styles.TextInputContainer}>
        <Ionicons name="md-search-outline" size={24} color="black" />
        <TextInput onChangeText={(value) => setQuery(value)} placeholder="Search" style={styles.TextInput} />
      </View>
      <View style={styles.chatCardContainer}>
        {chatData ? search(chatData).map((data) => (
          <TouchableOpacity key={data.id} onPress={() => navigation.navigate('chat', { roomid: data.id })}>
            <ChatCard chatData={data} />
          </TouchableOpacity>
        )) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: StatusBar.currentHeight,
    height: 70,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'mali-bold',
    color: '#333',
    marginLeft: 20,
  },
  TextInputContainer: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  TextInput: {
    width: '90%',
    marginLeft: 10,
    backgroundColor: '#fff',
  },
  chatCardContainer: {
    paddingHorizontal: 10,
  },
});
