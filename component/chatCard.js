/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import CONFIG from '../globals/Config';
import { globalStyles, RandomColor } from '../globals/globalStyles';
import UserInfoContex from '../helpers/Contex';

export default function ChatCard({ chatData }) {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const {
    creator,
    creatorProfileUrl,
    id,
    participant,
    participantProfileUrl,
    lastMessage,
  } = chatData;
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileBody}>
        <View style={styles.avatarContainer}>
          {(() => {
            if (userinfo.owner === creator) {
              if (participantProfileUrl) {
                return (
                  <Avatar
                    size={50}
                    rounded
                    source={{ uri: `${CONFIG.BASEURL}${participantProfileUrl}` }}
                  />
                );
              }
              return (
                <Avatar
                  size={50}
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
                  size={50}
                  rounded
                  source={{ uri: `${CONFIG.BASEURL}${creatorProfileUrl}` }}
                />
              );
            }
            return (
              <Avatar
                size={50}
                rounded
                title={creator[0]}
                overlayContainerStyle={{ backgroundColor: RandomColor() }}
                titleStyle={{ color: '#fff' }}
              />
            );
          })()}
        </View>
        <View>
          <Text style={styles.text}>{userinfo.owner === creator ? participant : creator}</Text>
          <Text style={styles.lastMessage}>
            {lastMessage ? `${lastMessage.sender}: ${lastMessage.message.length > 20
              ? `${lastMessage.message.substring(0, 20)}...` : lastMessage.message}`
              : 'start chatting'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 7,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  profileBody: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 20,
  },
  starContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  lastMessage: {
    color: 'gray',
    fontSize: 13,
  },
});
// {participantProfileUrl ? (
//   <Avatar
//     size={50}
//     rounded
//     source={{ uri: participantProfileUrl }}
//   />
// ) : (
//   <Avatar
//     size={50}
//     rounded
//     title={participant[0]}
//     overlayContainerStyle={{ backgroundColor: RandomColor() }}
//     titleStyle={{ color: '#fff' }}
//   />
// )}
