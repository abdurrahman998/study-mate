"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Animated, Easing, Alert } from "react-native"
import { styled } from "nativewind"
import SearchBar from "../components/SearchBar"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledAnimatedView = styled(Animated.View)

const PomodoroScreen = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState("pomodoro") // pomodoro, shortBreak, longBreak
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const spinValue = useRef(new Animated.Value(0)).current
  const timerRef = useRef(null)

  const timerModes = {
    pomodoro: { label: "Focus", time: 25 * 60, color: "bg-red-500" },
    shortBreak: { label: "Short Break", time: 5 * 60, color: "bg-green-500" },
    longBreak: { label: "Long Break", time: 15 * 60, color: "bg-blue-500" },
  }

  // Tasks for search suggestions
  const tasks = [
    "Complete math homework",
    "Study for physics exam",
    "Read biology chapter",
    "Write English essay",
    "Review chemistry notes",
    "Prepare history presentation",
  ]

  useEffect(() => {
    // Start rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Reset timer when mode changes
    setTimeLeft(timerModes[mode].time)
    setIsRunning(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [mode])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsRunning(false)
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning])

  const handleTimerComplete = () => {
    // Play sound or vibration here

    if (mode === "pomodoro") {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)

      Alert.alert("Pomodoro Complete!", "Great job! Take a break now.", [
        {
          text: "Take a Break",
          onPress: () => setMode(newCount % 4 === 0 ? "longBreak" : "shortBreak"),
        },
      ])
    } else {
      Alert.alert("Break Complete!", "Ready to focus again?", [
        {
          text: "Start Focusing",
          onPress: () => setMode("pomodoro"),
        },
      ])
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    const totalTime = timerModes[mode].time
    return (totalTime - timeLeft) / totalTime
  }

  const handleSearch = (text) => {
    setSearchQuery(text)

    if (text) {
      const filtered = tasks.filter((task) => task.toLowerCase().includes(text.toLowerCase()))
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setSuggestions([])
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <StyledView className="flex-1 bg-gray-50 px-4 pt-4">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        placeholder="What are you working on?"
      />

      <StyledView className="flex-row justify-center mt-6 mb-8">
        <StyledTouchableOpacity
          onPress={() => setMode("pomodoro")}
          className={`px-4 py-2 rounded-full mx-1 ${mode === "pomodoro" ? "bg-red-500" : "bg-gray-200"}`}
        >
          <StyledText className={`font-medium ${mode === "pomodoro" ? "text-white" : "text-gray-700"}`}>
            Focus
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => setMode("shortBreak")}
          className={`px-4 py-2 rounded-full mx-1 ${mode === "shortBreak" ? "bg-green-500" : "bg-gray-200"}`}
        >
          <StyledText className={`font-medium ${mode === "shortBreak" ? "text-white" : "text-gray-700"}`}>
            Short Break
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => setMode("longBreak")}
          className={`px-4 py-2 rounded-full mx-1 ${mode === "longBreak" ? "bg-blue-500" : "bg-gray-200"}`}
        >
          <StyledText className={`font-medium ${mode === "longBreak" ? "text-white" : "text-gray-700"}`}>
            Long Break
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView className="items-center justify-center flex-1">
        <StyledView className="relative items-center justify-center">
          <StyledAnimatedView
            className={`w-64 h-64 rounded-full ${timerModes[mode].color} opacity-10`}
            style={{ transform: [{ rotate: spin }] }}
          />

          <StyledView className="absolute items-center justify-center">
            <StyledText className="text-6xl font-bold text-gray-800">{formatTime(timeLeft)}</StyledText>

            <StyledText className="text-xl text-gray-600 mt-2">{timerModes[mode].label}</StyledText>

            {searchQuery ? (
              <StyledText className="text-sm text-gray-500 mt-4 text-center px-6">Working on: {searchQuery}</StyledText>
            ) : null}
          </StyledView>
        </StyledView>

        <StyledView className="flex-row mt-12 space-x-4">
          <StyledTouchableOpacity
            onPress={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-xl ${isRunning ? "bg-yellow-500" : "bg-indigo-600"}`}
          >
            <StyledText className="text-white font-bold text-lg">{isRunning ? "Pause" : "Start"}</StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => {
              setTimeLeft(timerModes[mode].time)
              setIsRunning(false)
            }}
            className="px-8 py-4 rounded-xl bg-gray-200"
          >
            <StyledText className="text-gray-700 font-bold text-lg">Reset</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledView className="mb-8 items-center">
        <StyledText className="text-gray-600 mb-2">Completed Pomodoros: {completedPomodoros}</StyledText>

        <StyledView className="flex-row">
          {[...Array(4)].map((_, index) => (
            <StyledView
              key={index}
              className={`w-4 h-4 mx-1 rounded-full ${index < (completedPomodoros % 4) ? "bg-red-500" : "bg-gray-300"}`}
            />
          ))}
        </StyledView>
      </StyledView>
    </StyledView>
  )
}

export default PomodoroScreen
