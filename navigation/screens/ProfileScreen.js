/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView, ActivityIndicator, Platform, Alert,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { ProfileItem } from '../../component/FormComponent';
import fetchAPI from '../../api';
import { RandomColor } from '../../globals/globalStyles';
import UserInfoContex from '../../helpers/Contex';
import Token from '../../helpers/Token';
import CONFIG from '../../globals/Config';

export default function ProfileScreen() {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [userProfile, setUserProfile] = useState(null);
  const handleLogout = async () => {
    const res = await fetchAPI.Signout(userinfo.refreshToken);
    if (res.status === 'success') {
      await Token.Delete('accessToken');
      await Token.Delete('refreshToken');
      setUserinfo((prev) => ({
        ...prev,
        refreshToken: null,
      }));
    }
  };

  useEffect(async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
          Alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
    const accToken = await Token.Get('accessToken');
    const { data } = await fetchAPI.GetUserInfo(accToken, userinfo.refreshToken);
    setUserProfile(data);
  }, []);

  const PickImage = async () => {
    const accToken = await Token.Get('accessToken');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      // eslint-disable-next-line no-undef
      const formdata = new FormData();
      formdata.append('data', { uri: result.uri, name: 'image.jpg', type: 'image/jpeg' });
      const { data: { fileLocation } } = await fetchAPI.uploadImage(formdata);
      const { data } = await fetchAPI.PutUpdateProfilePhoto(fileLocation, accToken, userinfo.refreshToken);
      setUserinfo((prev) => ({
        ...prev,
        profileUrl: data.profile_url,
      }));
    }
  };

  if (!userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.avatarContainer}>
          {userinfo.profileUrl || userProfile.profile_url ? (
            <Avatar
              onPress={PickImage}
              size={110}
              rounded
              source={{ uri: `${CONFIG.BASEURL}${userinfo.profileUrl}` }}
            />
          ) : (
            <Avatar
              onPress={PickImage}
              size={110}
              rounded
              title={userinfo.owner[0]}
              overlayContainerStyle={{ backgroundColor: RandomColor() }}
              titleStyle={{ color: '#fff' }}
            />
          )}
        </View>
        <View>
          <ProfileItem label="Full name" value={userProfile.fullname} />
          <ProfileItem label="Username" value={userProfile.username} />
          {userProfile.user_type === 'doctor' ? (
            <>
              <ProfileItem label="Specialist" value={userProfile.category} />
              <ProfileItem label="Str number" value={userProfile.str_number} />
            </>
          ) : null}
          <ProfileItem label="Gender" value={userProfile.gender} />
        </View>
      </View>
      <TouchableOpacity style={styles.buttonPrimary} onPress={() => handleLogout()}>
        <Text style={styles.buttonTextPrimary}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: StatusBar.currentHeight,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '500',
    fontFamily: 'mali-bold',
    color: '#333',
  },
  avatarContainer: {
    marginVertical: 10,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    marginTop: 30,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#112340',
    marginVertical: 20,
  },
  buttonTextPrimary: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
