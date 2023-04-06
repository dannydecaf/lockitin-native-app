import React from "react";
import StackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import { LogBox } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </NavigationContainer>
    </TailwindProvider>
  );
}

