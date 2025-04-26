"use client"

import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "./lib/supabase"

// Screens
import WelcomeScreen from "./screens/WelcomeScreen"
import LoginScreen from "./screens/LoginScreen"
import RoutineScreen from "./screens/RoutineScreen"
import NotesScreen from "./screens/NotesScreen"
import PomodoroScreen from "./screens/PomodoroScreen"
import QuizScreen from "./screens/QuizScreen"
import AddNoteScreen from "./screens/AddNoteScreen"
import EditRoutineScreen from "./screens/EditRoutineScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Auth context
export const AuthContext = React.createContext()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Routine") {
            iconName = focused ? "calendar" : "calendar-outline"
          } else if (route.name === "Notes") {
            iconName = focused ? "document-text" : "document-text-outline"
          } else if (route.name === "Pomodoro") {
            iconName = focused ? "timer" : "timer-outline"
          } else if (route.name === "Quiz") {
            iconName = focused ? "help-circle" : "help-circle-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#F9FAFB",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#4B5563",
        },
      })}
    >
      <Tab.Screen name="Routine" component={RoutineScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
        setIsLoggedIn(true)
      }
      setLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user)
        setIsLoggedIn(true)
      }
      if (event === "SIGNED_OUT") {
        setUser(null)
        setIsLoggedIn(false)
      }
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  if (loading) {
    return null // Or a loading screen
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen
                name="AddNote"
                component={AddNoteScreen}
                options={{
                  headerShown: true,
                  title: "Add New Note",
                  headerStyle: {
                    backgroundColor: "#F9FAFB",
                  },
                  headerTitleStyle: {
                    fontWeight: "bold",
                    color: "#4B5563",
                  },
                }}
              />
              <Stack.Screen
                name="EditRoutine"
                component={EditRoutineScreen}
                options={{
                  headerShown: true,
                  title: "Edit Routine",
                  headerStyle: {
                    backgroundColor: "#F9FAFB",
                  },
                  headerTitleStyle: {
                    fontWeight: "bold",
                    color: "#4B5563",
                  },
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}
