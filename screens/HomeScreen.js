import { useNavigation } from '@react-navigation/core';
import { Button, View, Text } from 'react-native'
import React from 'react'
import useAuth from "../hooks/useAuth";

const HomeScreen = () => {
    // const navigation = useNavigation();
    const { logout } = useAuth();

  return (
    <View>
      <Text>I am the HomeScreen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

export default HomeScreen