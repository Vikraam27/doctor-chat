import React from 'react';
import { Avatar } from 'react-native-elements';
import {
  View, StyleSheet, StatusBar, Text,
} from 'react-native';
import { globalStyles, RandomColor } from '../globals/globalStyles';
import CONFIG from '../globals/Config';

export default function Header({ name, profileUrl, userType }) {
  return (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        {profileUrl ? (
          <Avatar
            source={{ uri: `${CONFIG.BASEURL}${profileUrl}` }}
            rounded
            containerStyle={{ justifyContent: 'center' }}
            size={49}
          />
        ) : (
          <Avatar
            rounded
            title={name[0]}
            overlayContainerStyle={{ backgroundColor: RandomColor() }}
            titleStyle={{ color: '#fff' }}
            size={49}
          />
        )}
      </View>
      <View>
        <Text style={styles.headerTextName}>{name}</Text>
        <Text style={globalStyles.TextGray}>{userType}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: StatusBar.currentHeight,
    height: 70,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
  },
  headerTextName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'mali-bold',
    color: '#333',
    marginVertical: 1,
  },
});
