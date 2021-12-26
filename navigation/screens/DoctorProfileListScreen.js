import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, View, ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import fetchAPI from '../../api';
import Token from '../../helpers/Token';
import DoctorProfileCard from '../../component/doctorProfileCard';
import UserInfoContex from '../../helpers/Contex';

export default function DoctorProfileList({ navigation }) {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [doctors, setDoctors] = useState(null);
  useEffect(async () => {
    const accToken = await Token.Get('accessToken');
    const { data } = await fetchAPI.GetAllDoctors(accToken, userinfo.refreshToken);
    setDoctors(data);
  }, []);

  if (!doctors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {doctors ? doctors.map((data) => (
        <>
          <TouchableOpacity
            key={data.username}
            onPress={() => navigation.navigate('DoctorProfile', { username: data.username })}
          >
            <DoctorProfileCard
              profileUrl={data.profile_url}
              name={data.fullname}
              job={data.category}
              showStar={false}
            />
          </TouchableOpacity>
          <View style={{ borderBottomColor: '#333', borderBottomWidth: 0.4 }} />

        </>
      )) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  Text: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
