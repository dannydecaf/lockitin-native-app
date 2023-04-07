import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const AuthContext = createContext({});

WebBrowser.maybeCompleteAuthSession();

const config = {
  iosClientId:
    "367382106570-gfcgfuf29dffkdgem3m9d6aqf3hbr0aj.apps.googleusercontent.com",
  androidClientId:
    "367382106570-uqcbvm5jfcddk75990hb3av8i5dluap5.apps.googleusercontent.com",
  expoClientId:
    "367382106570-ekh9rif5d6hacl7gruusjlcs8icnhhb7.apps.googleusercontent.com",
  webClientId:
    "367382106570-ekh9rif5d6hacl7gruusjlcs8icnhhb7.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [resquest, response, promptAsync] = Google.useAuthRequest(config);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setLoadingInitial(false);
    });
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { idToken, accessToken } = response?.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      signInWithCredential(auth, credential);
    } else {
      setError(response?.error);
    }

    setLoading(false);
  }, [response]);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      signInWithGoogle: () => {
        setLoading(true);
        promptAsync({ useProxy: false, showInRecents: true });
      },
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
        {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
    return useContext(AuthContext);
}