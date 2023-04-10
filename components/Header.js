import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTailwind } from "tailwindcss-react-native";
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const Header = ({ title }) => { // destructuring title prop from the parent component
    const tailwind = useTailwind();
    const navigation = useNavigation(); // getting the navigation object from the current stack

    return (
    <View stlye={tailwind("p-2 flex-row items-center justify-between")}>
        <View style={tailwind("flex flex-row items-center")}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tailwind("p-2")}>
                <Ionicons name="chevron-back-outline" size={34} color="#283593" />
            </TouchableOpacity>
            <Text style={tailwind("text-2xl font-bold pl-2")}>{title}</Text>
        </View>
    </View>
  )
}

export default Header