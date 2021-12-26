import React from 'react';
import {
  Linking, StyleSheet, Text, TouchableNativeFeedback, View,
} from 'react-native';
import { Card, Divider } from 'react-native-elements';

export default function ArticleCard({ article }) {
  const defaultImg = 'https://static.foxnews.com/foxnews.com/content/uploads/2020/07/Coronavirus-iStock.jpg';
  return (
    <TouchableNativeFeedback onPress={() => Linking.openURL(article.link)}>
      <Card containerStyle={{ padding: 0, maxWidth: 330 }}>
        <Card.Image style={{ width: '100%' }} source={{ uri: article.image_url || defaultImg }} />
        <View style={{ padding: 5, height: 150 }}>
          <Card.Title style={styles.cardTitle}>{`${article.title.length < 110 ? article.title : `${article.title.substring(0, 110)}...`}`}</Card.Title>
          {article.description ? (
            <Text style={styles.description}>{`${article.description.length < 170 ? article.description : `${article.description.substring(0, 170)}...`}`}</Text>
          ) : <Text>Comming Soon </Text>}
        </View>
        <Divider style={{ backgroundColor: '#dfe6e9' }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.noteStyle}>{article.source_id}</Text>
          <Text style={styles.noteStyle}>{article.pubDate}</Text>
        </View>
      </Card>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    textAlign: 'left',
    fontWeight: '500',
    fontFamily: 'roboto-medium',
    marginHorizontal: 5,
    textShadowColor: '#00000f',
    textShadowRadius: 2,
    fontSize: 15,
  },
  description: {
    fontSize: 13,
  },
  noteStyle: {
    margin: 10,
    fontStyle: 'italic',
    color: '#b2bec3',
    fontSize: 12,
  },
  featuredTitleStyle: {
    marginHorizontal: 5,
    textShadowColor: '#00000f',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
  },
});
