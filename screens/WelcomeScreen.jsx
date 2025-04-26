import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native"
import { StatusBar } from "expo-status-bar"
import { styled } from "nativewind"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)
const StyledSafeAreaView = styled(SafeAreaView)

const WelcomeScreen = ({ navigation }) => {
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <StyledView className="flex-1 justify-center items-center px-6">
        <StyledImage source={require("../assets/study-logo.png")} className="w-40 h-40 mb-8" resizeMode="contain" />

        <StyledText className="text-3xl font-bold text-indigo-600 mb-2">StudyMate</StyledText>

        <StyledText className="text-gray-600 text-center text-lg mb-12">
          Your personal companion for better study habits
        </StyledText>

        <StyledView className="w-full space-y-4">
          <StyledTouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-indigo-600 py-4 rounded-xl w-full items-center"
          >
            <StyledText className="text-white font-semibold text-lg">Get Started</StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => navigation.navigate("Login", { isSignUp: true })}
            className="bg-white border border-indigo-600 py-4 rounded-xl w-full items-center"
          >
            <StyledText className="text-indigo-600 font-semibold text-lg">Create Account</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledText className="text-gray-500 mt-8 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </StyledText>
      </StyledView>
    </StyledSafeAreaView>
  )
}

export default WelcomeScreen
