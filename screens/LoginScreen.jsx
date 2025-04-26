"use client"

import { useState, useContext } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styled } from "nativewind"
import { supabase } from "../lib/supabase"
import { AuthContext } from "../App"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledSafeAreaView = styled(SafeAreaView)
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)
const StyledImage = styled(Image)

const LoginScreen = ({ navigation, route }) => {
  const isSignUp = route.params?.isSignUp || false
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setIsLoggedIn, setUser } = useContext(AuthContext)

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data?.user) {
          setUser(data.user)
          setIsLoggedIn(true)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data?.user) {
          setUser(data.user)
          setIsLoggedIn(true)
        }
      }
    } catch (error) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, bypass login
  const handleDemoLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <StyledKeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <StyledView className="px-6 pt-12 flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>

            <StyledView className="items-center my-8">
              <StyledImage source={require("../assets/study-logo.png")} className="w-24 h-24" resizeMode="contain" />
            </StyledView>

            <StyledText className="text-2xl font-bold text-gray-800 mb-8">
              {isSignUp ? "Create your account" : "Welcome back"}
            </StyledText>

            <StyledView className="space-y-4 mb-6">
              <StyledView>
                <StyledText className="text-gray-700 mb-2 font-medium">Email</StyledText>
                <StyledTextInput
                  className="bg-gray-100 p-4 rounded-xl text-gray-800"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </StyledView>

              <StyledView>
                <StyledText className="text-gray-700 mb-2 font-medium">Password</StyledText>
                <StyledTextInput
                  className="bg-gray-100 p-4 rounded-xl text-gray-800"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </StyledView>
            </StyledView>

            {error ? <StyledText className="text-red-500 mb-4">{error}</StyledText> : null}

            <StyledTouchableOpacity
              onPress={handleAuth}
              disabled={loading}
              className={`py-4 rounded-xl w-full items-center ${loading ? "bg-indigo-400" : "bg-indigo-600"}`}
            >
              <StyledText className="text-white font-semibold text-lg">
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              </StyledText>
            </StyledTouchableOpacity>

            {!isSignUp && (
              <StyledTouchableOpacity className="mt-4">
                <StyledText className="text-indigo-600 text-center">Forgot password?</StyledText>
              </StyledTouchableOpacity>
            )}

            <StyledView className="flex-row justify-center mt-8">
              <StyledText className="text-gray-600">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
              </StyledText>
              <StyledTouchableOpacity onPress={() => navigation.navigate("Login", { isSignUp: !isSignUp })}>
                <StyledText className="text-indigo-600 font-medium">{isSignUp ? "Sign In" : "Sign Up"}</StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            <StyledView className="mt-auto mb-8">
              <StyledTouchableOpacity
                onPress={handleDemoLogin}
                className="py-4 bg-gray-200 rounded-xl w-full items-center"
              >
                <StyledText className="text-gray-800 font-semibold">Continue as Demo User</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledKeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </StyledSafeAreaView>
  )
}

export default LoginScreen
