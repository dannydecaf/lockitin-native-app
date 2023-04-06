import { useNavigation } from '@react-navigation/core';
import { Button, View, Text } from 'react-native'
import React from 'react'
import useAuth from "../hooks/useAuth";
import { useTailwind } from 'tailwindcss-react-native';

const HomeScreen = () => {
  const tailwind = useTailwind();
    // const navigation = useNavigation();
    const { logout } = useAuth();

  return (
    <View style={tailwind("")}>
      <Text style={tailwind("text-red-800")}>I am the HomeScreen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

export default HomeScreen