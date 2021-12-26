import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import fetchAPI from '../../api';
import { Input } from '../../component/FormComponent';

export default function SignupScreen({ navigation }) {
  const [userType, setUserType] = useState('patients');
  const [gender, setGender] = useState('male');
  const [docterCategory, setDocterCategory] = useState('general practitioners');
  const [message, setMessage] = useState(null);

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [strNum, setStrNum] = useState();
  const [password, setPassword] = useState('');

  const scroll = useRef();

  const submitHandler = async () => {
    if (userType === 'patients') {
      if (!username || !fullname || !password || !userType || !email) {
        setMessage('please fill the form');
        scroll.current.scrollTo({ x: 0, y: 0, animated: true });
      }
      if (password.length <= 7) {
        setMessage('password must be less than 8');
      }
      if (username && fullname && password.length >= 7 && userType && email) {
        const res = await fetchAPI.PatiensSignup({
          username, fullname, password, userType, gender,
        });
        if (res.status === 'success') {
          navigation.navigate('signin', res.message);
        }
        if (res.status === 'fail') {
          setMessage(res.message);
          scroll.current.scrollTo({ x: 0, y: 0, animated: true });
        }
      }
    }
    if (userType === 'doctor') {
      if (!username || !fullname || !strNum || docterCategory || !password || !userType || !email) {
        setMessage('please fill the form');
        scroll.current.scrollTo({ x: 0, y: 0, animated: true });
      }
      if (password.length <= 7) {
        setMessage('password must be less than 8');
      }
      // eslint-disable-next-line max-len
      if (username && fullname && strNum && docterCategory && password.length >= 7 && userType && email) {
        const res = await fetchAPI.DoctorsSignup({
          username, fullname, password, userType, strNum, category: docterCategory, gender,
        });
        if (res.status === 'success') {
          navigation.navigate('signin', { message: res.message });
        }
        if (res.status === 'fail') {
          setMessage(res.message);
          scroll.current.scrollTo({ x: 0, y: 0, animated: true });
        }
      }
    }
  };

  useEffect(() => {
    console.log(message);
    console.log(userType);
  }, [message, userType]);

  return (
    <ScrollView ref={scroll}>
      <View style={styles.container}>
        <Text style={styles.HeadingText}> Sign Up</Text>
        <Image source={require('../../assets/chat.png')} />
        {message ? (
          <View style={styles.message}>
            <Text style={{ color: '#fff', fontSize: 15 }}>{message}</Text>
            <Ionicons onPress={() => setMessage('')} name="close" size={24} color="white" />
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <Input onChangeText={(value) => setFullname(value)} label="Full name" placeholder="Enter Your Full name" />
          <Input onChangeText={(value) => setUsername(value)} label="Username" placeholder="Enter Your Username" />
          <Input onChangeText={(value) => setEmail(value)} label="E-mail" placeholder="Enter Your E-mail" keyboardType="email-address" />
          <Text style={styles.label}>User Type</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={userType}
              onValueChange={(val) => {
                setUserType(val);
              }}
            >
              <Picker.Item label="Patients" value="patients" />
              <Picker.Item label="Doctor" value="doctor" />
            </Picker>
          </View>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={gender}
              onValueChange={(val) => {
                setGender(val);
              }}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Rather not say" value="unknonw" />
            </Picker>
          </View>
          {userType === 'doctor'
            ? (
              <>
                <Input onChangeText={(value) => setStrNum(value)} label="STR number" placeholder="Enter Your STR number" keyboardType="numeric" />
                <Text style={styles.label}>Category</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={docterCategory}
                    onValueChange={(val) => {
                      setDocterCategory(val);
                    }}
                  >
                    <Picker.Item label="General practitioners" value="general practitioners" />
                    <Picker.Item label="Pulmonary" value="pulmonary" />
                    <Picker.Item label="Neurologist" value="neurologist" />
                    <Picker.Item label="Dentist" value="dentist" />
                    <Picker.Item label="Cardiologist" value="cardiologist" />
                    <Picker.Item label="Dermatologist" value="dermatologist" />
                    <Picker.Item label="Oculist" value="oculist" />
                    <Picker.Item label="Obstetricians" value="obstetricians" />
                  </Picker>
                </View>
              </>
            ) : null}
          <Input onChangeText={(value) => setPassword(value)} label="Password" placeholder="Password must be at least 8 characters" secureTextEntry />
          <TouchableOpacity onPress={() => submitHandler()} style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Sign up</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center' }}>
            Already have account ?
            <Text onPress={() => navigation.navigate('signin')} style={{ color: 'blue' }}>
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
  picker: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#34CC99',
    marginBottom: 10,
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
    backgroundColor: '#c23232',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
