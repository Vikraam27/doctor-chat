/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../component/Header';
import { globalStyles } from '../../globals/globalStyles';
import Token from '../../helpers/Token';
import fetchAPI from '../../api';
import DoctorProfileCard from '../../component/doctorProfileCard';
import ArticleCard from '../../component/Article';
import UserInfoContex from '../../helpers/Contex';

export default function HomeScreen({ navigation }) {
  const [userinfo, setUserinfo] = useContext(UserInfoContex);
  const [doctors, setDoctors] = useState([]);
  const [covidData, setCovidData] = useState({
    cases: 0,
    deaths: 0,
    recovered: 0,
  });
  const [news, setNews] = useState([]);

  useEffect(async () => {
    const accToken = await Token.Get('accessToken');

    const { cases, deaths, recovered } = await fetchAPI.getCovidCase();
    const { data: doctor } = await fetchAPI.GetAllDoctors(accToken, userinfo.refreshToken);
    setDoctors(doctor.slice(0, 4));
    const { results } = await fetchAPI.getNews();
    setCovidData({ cases, deaths, recovered });
    setNews(results);

    if (!userinfo.owner) {
      const { data } = await fetchAPI.GetUserInfo(accToken, userinfo.refreshToken);
      setUserinfo((prev) => ({
        ...prev,
        owner: data.username,
        userType: data.user_type,
        profileUrl: data.profile_url,
      }));
    }
  }, []);

  const { cases, deaths, recovered } = covidData;

  if (!covidData.cases || !news.length || !userinfo.owner || !doctors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#112340" />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Header name={userinfo.owner} profileUrl={userinfo.profileUrl} userType={userinfo.userType} />
      {/* Covid case */}
      <View>
        <Text style={globalStyles.headingText}>Indonesia covid-19 cases</Text>
        <View style={styles.covidContainer}>
          <View style={{ ...styles.recoveryCase, ...styles.boxCase }}>
            <MaterialIcons color="#56c256" name="coronavirus" size={30} />
            <Text style={styles.textSecondary}>Recovery</Text>
            <Text style={styles.smallText}>{`${parseFloat(recovered).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`}</Text>
          </View>
          <View style={{ ...styles.activeCase, ...styles.boxCase }}>
            <MaterialIcons color="#c9c530" name="coronavirus" size={30} />
            <Text style={styles.textSecondary}>Cases</Text>
            <Text style={styles.smallText}>{`${parseFloat(cases).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`}</Text>
          </View>
          <View style={{ ...styles.deathCase, ...styles.boxCase }}>
            <MaterialIcons color="#ff7171" name="coronavirus" size={30} />
            <Text style={styles.textSecondary}>Deaths</Text>
            <Text style={styles.smallText}>{`${parseFloat(deaths).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`}</Text>
          </View>
        </View>
        {/* Doctor lists */}
        <View>
          <TouchableOpacity
            style={styles.doctorTitleContainer}
            onPress={() => navigation.navigate('listDoctor')}
          >
            <Text style={globalStyles.headingText}>Top rated doctor</Text>
            <MaterialIcons name="navigate-next" size={24} color="black" />
          </TouchableOpacity>
          {
            doctors ? doctors.map((data) => (
              <TouchableOpacity
                key={data.username}
                onPress={() => navigation.navigate('DoctorProfile', { username: data.username })}
              >
                <DoctorProfileCard
                  profileUrl={data.profile_url}
                  name={data.fullname}
                  job={data.category}
                />
              </TouchableOpacity>
            )) : null
          }
        </View>
        <Text style={globalStyles.headingText}>Top healty news</Text>
        <ScrollView horizontal>
          {news.length ? news.map((article, i) => (
            <ArticleCard key={i} article={article} />
          )) : null}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  covidContainer: {
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textSecondary: {
    fontSize: 12,
    color: 'gray',
  },
  activeCase: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    lineHeight: 20,
    borderColor: 'gray',
  },
  boxCase: {
    marginVertical: 10,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  doctorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallText: {
    fontSize: 12,
  },
});
