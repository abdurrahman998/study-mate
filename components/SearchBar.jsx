import { View, TextInput, TouchableOpacity, Text, FlatList } from "react-native"
import { styled } from "nativewind"
import { Ionicons } from "@expo/vector-icons"

const StyledView = styled(View)
const StyledTextInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledText = styled(Text)

const SearchBar = ({ searchQuery, setSearchQuery, suggestions, onSelectSuggestion, placeholder = "Search..." }) => {
  return (
    <StyledView className="relative">
      <StyledView className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
        <Ionicons name="search" size={20} color="#6B7280" />
        <StyledTextInput
          className="flex-1 py-3 px-2 text-gray-800"
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <StyledTouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </StyledTouchableOpacity>
        ) : null}
      </StyledView>

      {suggestions.length > 0 && (
        <StyledView className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-md z-10 border border-gray-200">
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <StyledTouchableOpacity onPress={() => onSelectSuggestion(item)} className="p-3 border-b border-gray-100">
                <StyledText className="text-gray-800">{item}</StyledText>
              </StyledTouchableOpacity>
            )}
            style={{ maxHeight: 200 }}
          />
        </StyledView>
      )}
    </StyledView>
  )
}

export default SearchBar
