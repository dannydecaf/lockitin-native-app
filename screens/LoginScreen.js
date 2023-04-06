import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useTailwind } from 'tailwindcss-react-native';
import { useNavigation } from '@react-navigation/core';

const LoginScreen = () => {
  const tailwind = useTailwind();
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tailwind("flex-1")}>
      <ImageBackground
      resizeMode="cover"
      style={tailwind("flex-1 object-contain")}
      source={require('../assets/lockitin-logo.jpg')}
      >
        <TouchableOpacity style={[tailwind("absolute bottom-10 w-52 bg-indigo-800 p-4 rounded-3xl"), { marginHorizontal: "30%"},]} onPress={signInWithGoogle}>
        <Text style={tailwind("font-semibold text-center color-white")}>Sign In</Text>
        </TouchableOpacity>
      </ImageBackground>

    </View>
  )
}

export default LoginScreen