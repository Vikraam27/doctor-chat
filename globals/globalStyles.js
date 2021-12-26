import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  TextGray: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'mali-regular',
  },
  headingText: {
    fontFamily: 'mali-bold',
    fontSize: 16,
  },
  smallTextGray: {
    color: 'gray',
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'mali-regular',
  },
});

export const RandomColor = () => {
  const hex = Math.floor(Math.random() * 0xFFFFFF);
  const color = `#${hex.toString(16)}`;

  return color;
};
