import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert,
  KeyboardAvoiding
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const AddNoteScreen = ({ navigation, route }) => {
  const isEditing = route.params?.isEditing || false;
  const existingNote = route.params?.note || null;
  
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [subject, setSubject] = useState(existingNote?.subject || 'Math');
  const [image, setImage] = useState(existingNote?.image_url || null);
  const [loading, setLoading] = useState(false);

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'English'];

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }
    
    setLoading(true);
    
    try {
      const noteData = {
        title,
        content,
        subject,
        has_image: !!image,
        image_url: image,
        created_at: new Date().toISOString()
      };
      
      if (isEditing) {
        // In a real app, this would be a Supabase query
        // const { error } = await supabase
        //   .from('notes')
        //   .update(noteData)
        //   .eq('id', existingNote.id);
        
        // if (error) throw error;
        
        console.log('Note updated:', { id: existingNote.id, ...noteData });
      } else {
        // In a real app, this would be a Supabase query
        // const { error } = await supabase
        //   .from('notes')
        //   .insert(noteData);
        
        // if (error) throw error;
        
        console.log('Note created:', noteData);
      }
      
      Alert.alert(
        'Success',
        `Note ${isEditing ? 'updated' : 'created'} successfully`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} note`);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = () => {
    // In a real app, this would use image picker
    Alert.alert(
      'Select Image Source',
      'Choose where you want to pick an image from',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera', 
          onPress: () => console.log('Camera selected') 
        },
        { 
          text: 'Gallery', 
          onPress: () => {
            // Mock setting an image
            setImage('https://example.com/image.jpg');
          } 
        }
      ]
    );
  };

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <StyledScrollView className="flex-1 px-4 pt-4">
        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Title</StyledText>
          <StyledTextInput
            className="bg-white p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="Enter note title"
            value={title}
            onChangeText={setTitle}
          />
        </StyledView>
        
        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Subject</StyledText>
          <StyledView className="flex-row flex-wrap">
            {subjects.map((item) => (
              <StyledTouchableOpacity
                key={item}
                onPress={() => setSubject(item)}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  subject === item ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <StyledText
                  className={`font-medium ${
                    subject === item ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {item}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>
        
        <StyledView className="mb-4">
          <StyledText className="text-gray-700 mb-2 font-medium">Content</StyledText>
          <StyledTextInput
            className="bg-white p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="Write your notes here..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            style={{ height: 200 }}
          />
        </StyledView>
        
        <StyledView className="mb-6">
          <StyledText className="text-gray-700 mb-2 font-medium">Image (Optional)</StyledText>
          
          {image ? (
            <StyledView className="mb-2">
              <StyledImage
                source={require('../assets/note-placeholder.png')}
                className="w-full h-40 rounded-xl"
                resizeMode="cover"
              />
              <StyledTouchableOpacity 
                onPress={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
              >
                <Ionicons name="close" size={16} color="white" />
              </StyledTouchableOpacity>
            </StyledView>
          ) : (
            <StyledTouchableOpacity
              onPress={handlePickImage}
              className="bg-gray-200 p-4 rounded-xl items-center justify-center h-40 border-dashed border-2 border-gray-300"
            >
              <Ionicons name="image-outline" size={40} color="#6B7280" />
              <StyledText className="text-gray-600 mt-2">Tap to add an image</StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>
        
        <StyledView className="mb-8">
          <StyledTouchableOpacity
            onPress={handleSaveNote}
            disabled={loading}
            className={`py-4 rounded-xl w-full items-center ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
          >
            <StyledText className="text-white font-semibold text-lg">
              {loading ? 'Saving...' : isEditing ? 'Update Note' : 'Save Note'}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
};

export default AddNoteScreen;
