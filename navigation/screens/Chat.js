import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import socket from 'socket.io-client';
import {
  ActivityIndicator,
  StatusBar, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Controller, useForm } from 'react-hook-form';
import fetchAPI from '../../api';
import Token from '../../helpers/Token';
import UserInfoContex from '../../helpers/Contex';
import CONFIG from '../../globals/Config';
import { RandomColor } from '../../globals/globalStyles';
import { InputMessage } from '../../component/FormComponent';

export default function Chat({ navigation, route }) {
  const [roomid] = useState(route.params.roomid);
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [roomInfo, setRoomInfo] = useState(null);
  const [messages, setMessage] = useState([]);
  const io = socket.connect(CONFIG.BASEURL, { transports: ['websocket'] });

  const { handleSubmit, control, reset } = useForm();
  const scrollViewRef = useRef();

  const onSubmit = async ({ message }) => {
    const accToken = await Token.Get('accessToken');
    const req = await fetchAPI.PostMessage(accToken, userinfo.refreshToken, roomid, 'text', message, userinfo.owner);
    if (!req.status === 'success') {
      Alert.alert('unable to send message');
    }
    setMessage([...messages, req.data]);
    io.emit('chatMsg', req.data);
    reset({ message: '' });
  };

  const keyboardWillHide = () => {
    Keyboard.dismiss();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      const accToken = await Token.Get('accessToken');
      // eslint-disable-next-line no-undef
      const formdata = new FormData();
      formdata.append('data', { uri: result.uri, name: 'image.jpg', type: 'image/jpeg' });
      const { data: { fileLocation } } = await fetchAPI.uploadImage(formdata);
      const req = await fetchAPI.PostMessage(accToken, userinfo.refreshToken, roomid, 'image', fileLocation, userinfo.owner);
      setMessage([...messages, req.data]);
      io.emit('chatMsg', req.data);
    }
  };

  useEffect(() => {
    io.on('connect', () => {
      console.log('socket connceted');
    });
    io.emit('joinRoom', { roomid });
    io.on('msg', (msg) => {
      setMessage([...messages, msg]);
    });

    return (() => {
      io.disconnect();
    });
  }, [messages.length]);

  useEffect(async () => {
    const accToken = await Token.Get('accessToken');
    const { data } = await fetchAPI.RoomChat(roomid, accToken, userinfo.refreshToken);
    setMessage(data.messages);
    setRoomInfo(data);
  }, [messages.length]);

  if (!roomInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }

  const {
    creator,
    creatorProfileUrl,
    participant,
    participantProfileUrl,
  } = roomInfo;
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/background.jpeg')} style={styles.imageContainer}>
        <View style={styles.headers}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: 30, height: 30, marginLeft: 10 }}
          >
            <Ionicons
              name="arrow-back"
              size={27}
              color="white"
            />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            {(() => {
              if (userinfo.owner === creator) {
                if (participantProfileUrl) {
                  return (
                    <Avatar
                      size={41}
                      rounded
                      source={{ uri: `${CONFIG.BASEURL}${participantProfileUrl}` }}
                    />
                  );
                }
                return (
                  <Avatar
                    size={41}
                    rounded
                    title={participant[0]}
                    overlayContainerStyle={{ backgroundColor: RandomColor() }}
                    titleStyle={{ color: '#fff' }}
                  />
                );
              }
              if (creatorProfileUrl) {
                return (
                  <Avatar
                    size={41}
                    rounded
                    source={{ uri: `${CONFIG.BASEURL}${creatorProfileUrl}` }}
                  />
                );
              }
              return (
                <Avatar
                  size={41}
                  rounded
                  title={creator[0]}
                  overlayContainerStyle={{ backgroundColor: RandomColor() }}
                  titleStyle={{ color: '#fff' }}
                />
              );
            })()}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.text}>{userinfo.owner === creator ? participant : creator}</Text>
            <Text style={styles.textGray}>Patients</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => keyboardWillHide()}>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
            style={styles.messageContent}
          >
            <Text style={styles.date}>{(new Date(roomInfo.createdAt)).toLocaleDateString('id-ID')}</Text>
            {messages ? messages.map((msg) => (
              msg.messageType === 'text' ? (
                <View
                  key={msg.timestamp}
                  style={[styles.message,
                    msg.sender === userinfo.owner ? styles.reciver : styles.sender]}
                >
                  <Text style={styles.senderTitle}>{msg.sender}</Text>
                  <Text style={styles.msgBody}>{msg.message}</Text>
                  <Text style={styles.timestamp}>
                    {`${(new Date(msg.timestamp)).toLocaleDateString()} ${(new Date(msg.timestamp)).toLocaleTimeString()}`}
                  </Text>
                </View>
              ) : (
                <View
                  key={msg.timestamp}
                  style={[styles.imageMsgContainer,
                    msg.sender === userinfo.owner ? styles.reciver : styles.sender]}
                >
                  <Text style={styles.senderTitle}>{msg.sender}</Text>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      maxHeight: 200,
                    }}
                    source={{ uri: `${CONFIG.BASEURL}${msg.message}` }}
                  />
                  <Text style={styles.timestamp}>
                    {`${(new Date(msg.timestamp)).toLocaleDateString()} ${(new Date(msg.timestamp)).toLocaleTimeString()}`}
                  </Text>
                </View>
              )
            )) : null}

          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputMessage
                onChangeText={(val) => onChange(val)}
                value={value}
              />
            )}
            name="message"
            rules={{ required: true }}
          />
          <TouchableHighlight onPress={pickImage} style={styles.buttonContainer}>
            <Ionicons name="attach" size={24} color="#fff" />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={handleSubmit(onSubmit)}
            style={styles.buttonContainer}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableHighlight>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  imageContainer: {
    height: '100%',
    width: '100%',
  },
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112340',
    height: 60,
  },
  avatarContainer: {
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#fff',
  },
  headerInfo: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  textGray: {
    color: 'gray',
  },
  messageContent: {
    flex: 1,
  },
  date: {
    textAlign: 'center',
    margin: 10,
    color: 'gray',
    letterSpacing: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#fff',
    padding: 10,
  },
  buttonContainer: {
    marginHorizontal: 5,
    backgroundColor: '#112340',
    padding: 10,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    position: 'relative',
    margin: 20,
    padding: 10,
    minWidth: 170,
  },
  imageMsgContainer: {
    position: 'relative',
    width: 300,
    height: 254,
    margin: 10,
    padding: 10,
  },
  sender: {
    backgroundColor: '#E5FFCC',
    alignSelf: 'flex-start',
  },
  reciver: {
    backgroundColor: '#e2f2d3',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  senderTitle: {
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 6,
    textAlign: 'right',
  },
});
