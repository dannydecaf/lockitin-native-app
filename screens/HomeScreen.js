import { useNavigation } from '@react-navigation/core';
import { Button, View, Text } from 'react-native'
import React from 'react'

const HomeScreen = () => {
    const navigation = useNavigation();

  return (
    <View>
      <Text>I am the HomeScreen</Text>
      <Button title="Go to Chats" onPress={() => navigation.navigate('Chat')  } />
    </View>
  )
}

export default HomeScreen