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
      <ImageBackground
      resizeMode="cover"
      style={tailwind("flex-1 object-contain")}
      source={require('../assets/lockitin-logo.jpg')}
      >
        <View style={tailwind("flex-1 justify-center items-center")}>
        <TouchableOpacity style={[tailwind("flex-1 justify-center absolute bottom-10 w-52 bg-indigo-800 p-4 rounded-3xl"),]} onPress={signInWithGoogle}>
        <Text style={tailwind("font-semibold text-center color-white")}>Sign In</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>

  )
}

export default LoginScreen