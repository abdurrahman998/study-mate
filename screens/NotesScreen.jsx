"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from "react-native"
import { styled } from "nativewind"
import { Ionicons } from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)

const NotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("All")

  const subjects = ["All", "Math", "Physics", "Chemistry", "Biology", "History", "English"]

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      // In a real app, this would be a Supabase query
      // const { data, error } = await supabase
      //   .from('notes')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      // if (error) throw error;

      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          title: "Calculus Formulas",
          content: "Important formulas for calculus exam including derivatives and integrals.",
          subject: "Math",
          created_at: "2023-05-15T10:30:00Z",
          has_image: true,
          image_url: "https://example.com/math.jpg",
        },
        {
          id: 2,
          title: "Newton's Laws of Motion",
          content: "Detailed notes on Newton's three laws of motion with examples.",
          subject: "Physics",
          created_at: "2023-05-14T14:20:00Z",
          has_image: false,
        },
        {
          id: 3,
          title: "Periodic Table Elements",
          content: "Notes on the first 20 elements of the periodic table with their properties.",
          subject: "Chemistry",
          created_at: "2023-05-13T09:15:00Z",
          has_image: true,
          image_url: "https://example.com/chemistry.jpg",
        },
        {
          id: 4,
          title: "Cell Structure",
          content: "Detailed notes on eukaryotic and prokaryotic cell structures.",
          subject: "Biology",
          created_at: "2023-05-12T16:45:00Z",
          has_image: true,
          image_url: "https://example.com/biology.jpg",
        },
        {
          id: 5,
          title: "World War II Timeline",
          content: "Chronological events of World War II from 1939 to 1945.",
          subject: "History",
          created_at: "2023-05-11T11:30:00Z",
          has_image: false,
        },
        {
          id: 6,
          title: "Shakespeare's Sonnets Analysis",
          content: "Analysis of key themes in Shakespeare's most famous sonnets.",
          subject: "English",
          created_at: "2023-05-10T13:20:00Z",
          has_image: false,
        },
      ]

      setNotes(mockData)
      setFilteredNotes(mockData)
    } catch (error) {
      console.error("Error fetching notes:", error)
      Alert.alert("Error", "Failed to load notes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedSubject === "All") {
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.subject === selectedSubject &&
            (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
      )
    }
  }, [selectedSubject, searchQuery, notes])

  const handleSearch = (text) => {
    setSearchQuery(text)

    if (text) {
      // Generate suggestions
      const suggestionList = notes
        .map((item) => item.title)
        .filter((title) => title.toLowerCase().includes(text.toLowerCase()))
      setSuggestions([...new Set(suggestionList)])
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setSuggestions([])
  }

  const handleDeleteNote = (id) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // In a real app, this would be a Supabase query
            // const { error } = await supabase
            //   .from('notes')
            //   .delete()
            //   .eq('id', id);

            // if (error) throw error;

            // Mock deletion
            const updatedNotes = notes.filter((item) => item.id !== id)
            setNotes(updatedNotes)
          } catch (error) {
            console.error("Error deleting note:", error)
            Alert.alert("Error", "Failed to delete note")
          }
        },
      },
    ])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderNoteItem = ({ item }) => (
    <StyledTouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      onPress={() => navigation.navigate("AddNote", { note: item, isEditing: true })}
    >
      <StyledView className="flex-row justify-between">
        <StyledView className="flex-1 mr-3">
          <StyledText className="text-lg font-bold text-gray-800">{item.title}</StyledText>
          <StyledText className="text-gray-600 mt-1 text-sm" numberOfLines={2}>
            {item.content}
          </StyledText>

          <StyledView className="flex-row mt-3 items-center">
            <StyledView className="bg-indigo-100 rounded-full px-3 py-1 mr-2">
              <StyledText className="text-indigo-700 text-xs font-medium">{item.subject}</StyledText>
            </StyledView>
            <StyledText className="text-gray-500 text-xs">{formatDate(item.created_at)}</StyledText>
          </StyledView>
        </StyledView>

        {item.has_image && (
          <StyledView className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
            <StyledImage
              source={require("../assets/note-placeholder.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </StyledView>
        )}
      </StyledView>

      <StyledView className="absolute top-3 right-3">
        <StyledTouchableOpacity
          onPress={() => handleDeleteNote(item.id)}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledTouchableOpacity>
  )

  return (
    <StyledView className="flex-1 bg-gray-50 px-4 pt-4">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        placeholder="Search notes..."
      />

      <StyledView className="mt-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={subjects}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <StyledTouchableOpacity
              onPress={() => setSelectedSubject(item)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedSubject === item ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <StyledText className={`font-medium ${selectedSubject === item ? "text-white" : "text-gray-700"}`}>
                {item}
              </StyledText>
            </StyledTouchableOpacity>
          )}
        />
      </StyledView>

      <StyledView className="flex-row justify-between items-center mt-6 mb-4">
        <StyledText className="text-xl font-bold text-gray-800">My Notes</StyledText>

        <StyledTouchableOpacity
          onPress={() => navigation.navigate("AddNote")}
          className="bg-indigo-600 px-4 py-2 rounded-full flex-row items-center"
        >
          <Ionicons name="add" size={20} color="white" />
          <StyledText className="text-white font-medium ml-1">Add Note</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </StyledView>
      ) : filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNoteItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <StyledView className="flex-1 justify-center items-center">
          <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
          <StyledText className="text-gray-500 mt-4 text-lg">No notes found</StyledText>
          <StyledTouchableOpacity
            onPress={() => navigation.navigate("AddNote")}
            className="mt-4 bg-indigo-600 px-6 py-3 rounded-xl"
          >
            <StyledText className="text-white font-medium">Create New Note</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  )
}

export default NotesScreen
