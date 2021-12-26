import React from 'react';
import {
  StyleSheet, Text, TextInput, View,
} from 'react-native';

export function Input({
  label, placeholder, keyboardType, value, onChangeText, editable, secureTextEntry, disable,
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { color: editable ? 'black' : 'black' }]}
        keyboardType={keyboardType}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        disabled={disable}
        selectTextOnFocus={!disable}
        editable={editable}
      />
    </View>
  );
}

export function ProfileItem({ label, value }) {
  return (
    <View style={profileItemStyle.container}>
      <Text style={profileItemStyle.label}>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
      <Text style={profileItemStyle.value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
    </View>
  );
}

const profileItemStyle = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 3,
    color: 'gray',
  },
  value: {
    fontSize: 14,
    padding: 12,
    paddingBottom: 5,
    marginBottom: 10,
    color: '#333',
  },
});

export function InputMessage({
  value, onChangeText, editable, disable, secureTextEntry,
}) {
  return (
    <TextInput
      style={{
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#fff',
        padding: 10,
      }}
      placeholder="Input the message "
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      disabled={disable}
      selectTextOnFocus={!disable}
      editable={editable}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    borderColor: '#34CC99',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 6,
    marginTop: 3,
  },
});
