"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Alert } from "react-native"
import { styled } from "nativewind"
import { Ionicons } from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

const RoutineScreen = ({ navigation }) => {
  const [routines, setRoutines] = useState([])
  const [filteredRoutines, setFilteredRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [selectedDay, setSelectedDay] = useState("Monday")

  useEffect(() => {
    fetchRoutines()
  }, [selectedDay])

  const fetchRoutines = async () => {
    setLoading(true)
    try {
      // In a real app, this would be a Supabase query
      // const { data, error } = await supabase
      //   .from('routines')
      //   .select('*')
      //   .eq('day', selectedDay);

      // if (error) throw error;

      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          day: "Monday",
          title: "Mathematics",
          type: "Class",
          time: "09:00 AM - 10:30 AM",
          location: "Room 101",
        },
        { id: 2, day: "Monday", title: "Physics", type: "Class", time: "11:00 AM - 12:30 PM", location: "Lab 3" },
        {
          id: 3,
          day: "Monday",
          title: "Chemistry Coaching",
          type: "Coaching",
          time: "02:00 PM - 03:30 PM",
          location: "Study Center",
        },
        { id: 4, day: "Tuesday", title: "Biology", type: "Class", time: "09:00 AM - 10:30 AM", location: "Room 205" },
        {
          id: 5,
          day: "Tuesday",
          title: "English Literature",
          type: "Class",
          time: "11:00 AM - 12:30 PM",
          location: "Room 304",
        },
        {
          id: 6,
          day: "Wednesday",
          title: "Computer Science",
          type: "Class",
          time: "09:00 AM - 10:30 AM",
          location: "Lab 2",
        },
        {
          id: 7,
          day: "Wednesday",
          title: "Mathematics Coaching",
          type: "Coaching",
          time: "02:00 PM - 03:30 PM",
          location: "Study Center",
        },
        { id: 8, day: "Thursday", title: "History", type: "Class", time: "09:00 AM - 10:30 AM", location: "Room 102" },
        { id: 9, day: "Friday", title: "Geography", type: "Class", time: "11:00 AM - 12:30 PM", location: "Room 201" },
      ]

      const dayData = mockData.filter((item) => item.day === selectedDay)
      setRoutines(dayData)
      setFilteredRoutines(dayData)
    } catch (error) {
      console.error("Error fetching routines:", error)
      Alert.alert("Error", "Failed to load routines")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (text) => {
    setSearchQuery(text)

    if (text) {
      const filtered = routines.filter(
        (item) =>
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.location.toLowerCase().includes(text.toLowerCase()),
      )
      setFilteredRoutines(filtered)

      // Generate suggestions
      const suggestionList = routines
        .map((item) => item.title)
        .filter((title) => title.toLowerCase().includes(text.toLowerCase()))
      setSuggestions([...new Set(suggestionList)])
    } else {
      setFilteredRoutines(routines)
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    const filtered = routines.filter((item) => item.title.toLowerCase().includes(suggestion.toLowerCase()))
    setFilteredRoutines(filtered)
    setSuggestions([])
  }

  const handleDeleteRoutine = (id) => {
    Alert.alert("Delete Routine", "Are you sure you want to delete this routine?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // In a real app, this would be a Supabase query
            // const { error } = await supabase
            //   .from('routines')
            //   .delete()
            //   .eq('id', id);

            // if (error) throw error;

            // Mock deletion
            const updatedRoutines = routines.filter((item) => item.id !== id)
            setRoutines(updatedRoutines)
            setFilteredRoutines(updatedRoutines)
          } catch (error) {
            console.error("Error deleting routine:", error)
            Alert.alert("Error", "Failed to delete routine")
          }
        },
      },
    ])
  }

  const renderRoutineItem = ({ item }) => (
    <StyledView className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <StyledView className="flex-row justify-between items-start">
        <StyledView>
          <StyledText className="text-lg font-bold text-gray-800">{item.title}</StyledText>
          <StyledText className="text-gray-600 mt-1">{item.time}</StyledText>
          <StyledText className="text-gray-500 mt-1">{item.location}</StyledText>
          <StyledView className="bg-indigo-100 rounded-full px-3 py-1 mt-2 self-start">
            <StyledText className="text-indigo-700 text-xs font-medium">{item.type}</StyledText>
          </StyledView>
        </StyledView>

        <StyledView className="flex-row">
          <StyledTouchableOpacity
            onPress={() => navigation.navigate("EditRoutine", { routine: item })}
            className="mr-2"
          >
            <Ionicons name="pencil" size={20} color="#6366F1" />
          </StyledTouchableOpacity>

          <StyledTouchableOpacity onPress={() => handleDeleteRoutine(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  )

  return (
    <StyledView className="flex-1 bg-gray-50 px-4 pt-4">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        placeholder="Search classes or locations..."
      />

      <StyledView className="mt-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={days}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <StyledTouchableOpacity
              onPress={() => setSelectedDay(item)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedDay === item ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <StyledText className={`font-medium ${selectedDay === item ? "text-white" : "text-gray-700"}`}>
                {item.substring(0, 3)}
              </StyledText>
            </StyledTouchableOpacity>
          )}
        />
      </StyledView>

      <StyledView className="flex-row justify-between items-center mt-6 mb-4">
        <StyledText className="text-xl font-bold text-gray-800">{selectedDay}'s Schedule</StyledText>

        <StyledTouchableOpacity
          onPress={() => navigation.navigate("EditRoutine", { day: selectedDay })}
          className="bg-indigo-600 px-4 py-2 rounded-full flex-row items-center"
        >
          <Ionicons name="add" size={20} color="white" />
          <StyledText className="text-white font-medium ml-1">Add</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </StyledView>
      ) : filteredRoutines.length > 0 ? (
        <FlatList
          data={filteredRoutines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRoutineItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <StyledView className="flex-1 justify-center items-center">
          <Ionicons name="calendar-outline" size={60} color="#D1D5DB" />
          <StyledText className="text-gray-500 mt-4 text-lg">No classes or coaching scheduled</StyledText>
          <StyledTouchableOpacity
            onPress={() => navigation.navigate("EditRoutine", { day: selectedDay })}
            className="mt-4 bg-indigo-600 px-6 py-3 rounded-xl"
          >
            <StyledText className="text-white font-medium">Add New Schedule</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  )
}

export default RoutineScreen
