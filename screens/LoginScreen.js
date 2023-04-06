import { View, Text, Button } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { useTailwind } from 'tailwindcss-react-native';

const LoginScreen = () => {
  const tailwind = useTailwind();
  const { signInWithGoogle } = useAuth();

  return (
    <View style={tailwind("")}>
      <Text style={tailwind("text-red-500")}>Login to Lockitin</Text>
      <Button title="Login" onPress={ signInWithGoogle } />
    </View>
  )
}

export default LoginScreen