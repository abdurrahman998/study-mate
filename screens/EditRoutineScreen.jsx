"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { styled } from "nativewind"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)

const EditRoutineScreen = ({ navigation, route }) => {
  const existingRoutine = route.params?.routine || null
  const selectedDay = route.params?.day || "Monday"
  const isEditing = !!existingRoutine

  const [title, setTitle] = useState(existingRoutine?.title || "")
  const [type, setType] = useState(existingRoutine?.type || "Class")
  const [time, setTime] = useState(existingRoutine?.time || "09:00 AM - 10:30 AM")
  const [location, setLocation] = useState(existingRoutine?.location || "")
  const [loading, setLoading] = useState(false)

  const types = ["Class", "Coaching", "Self-Study", "Group Study", "Lab"]

  const handleSaveRoutine = async () => {
    if (!title.trim() || !time.trim() || !location.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const routineData = {
        title,
        type,
        time,
        location,
        day: selectedDay,
      }

      if (isEditing) {
        // In a real app, this would be a Supabase query
        // const { error } = await supabase
        //   .from('routines')
        //   .update(routineData)
        //   .eq('id', existingRoutine.id);

        // if (error) throw error;

        console.log("Routine updated:", { id: existingRoutine.id, ...routineData })
      } else {
        // In a real app, this would be a Supabase query
        // const { error } = await supabase
        //   .from('routines')
        //   .insert(routineData);

        // if (error) throw error;

        console.log("Routine created:", routineData)
      }

      Alert.alert("Success", `Routine ${isEditing ? "updated" : "created"} successfully`, [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Error saving routine:", error)
      Alert.alert("Error", `Failed to ${isEditing ? "update" : "create"} routine`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledKeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <StyledScrollView className="flex-1 px-4 pt-4">
        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Day</StyledText>
          <StyledView className="bg-white p-4 rounded-xl border border-gray-200">
            <StyledText className="text-gray-800">{selectedDay}</StyledText>
          </StyledView>
        </StyledView>

        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Title</StyledText>
          <StyledTextInput
            className="bg-white p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="e.g., Mathematics, Physics"
            value={title}
            onChangeText={setTitle}
          />
        </StyledView>

        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Type</StyledText>
          <StyledView className="flex-row flex-wrap">
            {types.map((item) => (
              <StyledTouchableOpacity
                key={item}
                onPress={() => setType(item)}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${type === item ? "bg-indigo-600" : "bg-gray-200"}`}
              >
                <StyledText className={`font-medium ${type === item ? "text-white" : "text-gray-700"}`}>
                  {item}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>

        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Time</StyledText>
          <StyledTextInput
            className="bg-white p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="e.g., 09:00 AM - 10:30 AM"
            value={time}
            onChangeText={setTime}
          />
        </StyledView>

        <StyledView className="mb-6">
          <StyledText className="text-gray-700 mb-2 font-medium">Location</StyledText>
          <StyledTextInput
            className="bg-white p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="e.g., Room 101, Lab 3"
            value={location}
            onChangeText={setLocation}
          />
        </StyledView>

        <StyledView className="mb-8">
          <StyledTouchableOpacity
            onPress={handleSaveRoutine}
            disabled={loading}
            className={`py-4 rounded-xl w-full items-center ${loading ? "bg-indigo-400" : "bg-indigo-600"}`}
          >
            <StyledText className="text-white font-semibold text-lg">
              {loading ? "Saving..." : isEditing ? "Update Routine" : "Add to Schedule"}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  )
}

export default EditRoutineScreen
