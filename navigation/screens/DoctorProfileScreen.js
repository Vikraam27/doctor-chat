/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import fetchAPI from '../../api';
import { ProfileItem } from '../../component/FormComponent';
import CONFIG from '../../globals/Config';
import { RandomColor } from '../../globals/globalStyles';
import UserInfoContex from '../../helpers/Contex';
import Token from '../../helpers/Token';

export default function DoctorProfile({ route }) {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const { refreshToken, owner } = userinfo;

  const clickHandler = async () => {
    const accToken = await Token.Get('accessToken');
    const roomid = await fetchAPI.PostCreateRoom({
      accessToken: accToken,
      refreshToken,
      username: owner,
      participant: doctorInfo.username,
    });

    console.log(roomid);
  };

  useEffect(async () => {
    const accToken = await Token.Get('accessToken');
    const { data } = await fetchAPI.GetProfileDoctor(accToken, refreshToken, route.params.username);
    setDoctorInfo(data);
  }, []);

  if (!route.params?.username || !doctorInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.avatarContainer}>
          {doctorInfo.profile_url ? (
            <Avatar
              size={110}
              rounded
              source={{ uri: `${CONFIG.BASEURL}${doctorInfo.profile_url}` }}
            />
          ) : (
            <Avatar
              size={110}
              rounded
              title={doctorInfo.username[0]}
              overlayContainerStyle={{ backgroundColor: RandomColor() }}
              titleStyle={{ color: '#fff' }}
            />
          )}
          <View>
            <Text style={styles.name}>{doctorInfo.fullname}</Text>
            <Text style={styles.gender}>{doctorInfo.gender}</Text>
          </View>
        </View>
        <ProfileItem label="Username" value={doctorInfo.username} />
        <ProfileItem label="STR Number" value={doctorInfo.str_number} />
        <ProfileItem label="Specialist" value={doctorInfo.category} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => clickHandler()}
        >
          <Text style={styles.buttonText}>Start Converstation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginTop: 30,
    marginVertical: 10,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  gender: {
    fontSize: 16,
    fontWeight: '400',
    color: 'gray',
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  button: {
    marginTop: 32,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#112340',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
