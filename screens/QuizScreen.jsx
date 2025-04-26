"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { styled } from "nativewind"
import { Ionicons } from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)

const QuizScreen = () => {
  const [quizzes, setQuizzes] = useState([])
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  // Quiz categories for search
  const categories = ["Math", "Physics", "Chemistry", "Biology", "History", "English"]

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      // In a real app, this would be a Supabase query
      // const { data, error } = await supabase
      //   .from('quizzes')
      //   .select('*');

      // if (error) throw error;

      // Mock data for demonstration
      const mockQuizzes = [
        {
          id: 1,
          title: "Daily Math Quiz",
          category: "Math",
          questions: [
            {
              id: 1,
              question: "What is the value of π (pi) to two decimal places?",
              options: ["3.14", "3.16", "3.12", "3.18"],
              correctAnswer: "3.14",
            },
            {
              id: 2,
              question: "What is the square root of 144?",
              options: ["12", "14", "10", "16"],
              correctAnswer: "12",
            },
            {
              id: 3,
              question: "If x + y = 10 and x - y = 4, what is the value of x?",
              options: ["7", "6", "8", "5"],
              correctAnswer: "7",
            },
            {
              id: 4,
              question: "What is the formula for the area of a circle?",
              options: ["πr²", "2πr", "πd", "2πr²"],
              correctAnswer: "πr²",
            },
            {
              id: 5,
              question: "What is 25% of 80?",
              options: ["20", "25", "15", "40"],
              correctAnswer: "20",
            },
          ],
        },
        {
          id: 2,
          title: "Physics Fundamentals",
          category: "Physics",
          questions: [
            {
              id: 1,
              question: "What is Newton's First Law of Motion?",
              options: [
                "An object at rest stays at rest unless acted upon by a force",
                "Force equals mass times acceleration",
                "For every action, there is an equal and opposite reaction",
                "Energy cannot be created or destroyed",
              ],
              correctAnswer: "An object at rest stays at rest unless acted upon by a force",
            },
            {
              id: 2,
              question: "What is the SI unit of force?",
              options: ["Newton", "Joule", "Watt", "Pascal"],
              correctAnswer: "Newton",
            },
            {
              id: 3,
              question: "What does E=mc² represent?",
              options: [
                "Mass-energy equivalence",
                "Gravitational potential energy",
                "Kinetic energy",
                "Electric potential",
              ],
              correctAnswer: "Mass-energy equivalence",
            },
            {
              id: 4,
              question: "Which scientist proposed the theory of relativity?",
              options: ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Galileo Galilei"],
              correctAnswer: "Albert Einstein",
            },
            {
              id: 5,
              question: "What is the speed of light in a vacuum?",
              options: ["299,792,458 m/s", "300,000,000 m/s", "310,000,000 m/s", "290,000,000 m/s"],
              correctAnswer: "299,792,458 m/s",
            },
          ],
        },
      ]

      setQuizzes(mockQuizzes)
      setCurrentQuiz(mockQuizzes[0]) // Set the first quiz as default
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      Alert.alert("Error", "Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (text) => {
    setSearchQuery(text)

    if (text) {
      const filtered = categories.filter((category) => category.toLowerCase().includes(text.toLowerCase()))
      setSuggestions(filtered)

      // Filter quizzes based on search
      const filteredQuiz = quizzes.find((quiz) => quiz.category.toLowerCase().includes(text.toLowerCase()))

      if (filteredQuiz) {
        resetQuiz(filteredQuiz)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setSuggestions([])

    const filteredQuiz = quizzes.find((quiz) => quiz.category === suggestion)

    if (filteredQuiz) {
      resetQuiz(filteredQuiz)
    }
  }

  const resetQuiz = (quiz = currentQuiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizCompleted(false)
  }

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null) return // Prevent changing answer

    setSelectedAnswer(answer)

    // Check if answer is correct
    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    if (answer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1)
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        setSelectedAnswer(null)
      } else {
        setQuizCompleted(true)
        saveQuizResult()
      }
    }, 1000)
  }

  const saveQuizResult = async () => {
    try {
      // In a real app, this would be a Supabase query
      // const { error } = await supabase
      //   .from('quiz_results')
      //   .insert({
      //     quiz_id: currentQuiz.id,
      //     score: score,
      //     total_questions: currentQuiz.questions.length,
      //     completed_at: new Date()
      //   });

      // if (error) throw error;

      console.log("Quiz result saved:", {
        quiz_id: currentQuiz.id,
        score: score,
        total_questions: currentQuiz.questions.length,
      })
    } catch (error) {
      console.error("Error saving quiz result:", error)
    }
  }

  const renderQuestion = () => {
    if (!currentQuiz || currentQuiz.questions.length === 0) return null

    const currentQuestion = currentQuiz.questions[currentQuestionIndex]

    return (
      <StyledView className="bg-white rounded-xl p-6 shadow-sm">
        <StyledText className="text-lg font-bold text-gray-800 mb-6">
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </StyledText>

        <StyledView className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <StyledTouchableOpacity
              key={index}
              onPress={() => handleSelectAnswer(option)}
              className={`p-4 rounded-xl border ${
                selectedAnswer === null
                  ? "border-gray-300"
                  : selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : option === currentQuestion.correctAnswer && selectedAnswer !== null
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
              }`}
            >
              <StyledText
                className={`font-medium ${
                  selectedAnswer === null
                    ? "text-gray-700"
                    : selectedAnswer === option
                      ? option === currentQuestion.correctAnswer
                        ? "text-green-700"
                        : "text-red-700"
                      : option === currentQuestion.correctAnswer && selectedAnswer !== null
                        ? "text-green-700"
                        : "text-gray-700"
                }`}
              >
                {option}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>

        <StyledView className="flex-row justify-between mt-8">
          <StyledText className="text-gray-600">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </StyledText>

          <StyledText className="text-indigo-600 font-medium">Score: {score}</StyledText>
        </StyledView>
      </StyledView>
    )
  }

  const renderQuizComplete = () => (
    <StyledView className="bg-white rounded-xl p-6 shadow-sm items-center">
      <Ionicons name="trophy" size={60} color="#6366F1" />

      <StyledText className="text-2xl font-bold text-gray-800 mt-4">Quiz Completed!</StyledText>

      <StyledText className="text-gray-600 text-lg mt-2 mb-6">
        Your score: {score} out of {currentQuiz.questions.length}
      </StyledText>

      <StyledView className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <StyledView
          className="bg-indigo-600 h-full"
          style={{ width: `${(score / currentQuiz.questions.length) * 100}%` }}
        />
      </StyledView>

      <StyledText className="text-gray-600 mt-6 mb-8">
        {score === currentQuiz.questions.length
          ? "Perfect score! Excellent work! 🎉"
          : score >= currentQuiz.questions.length * 0.8
            ? "Great job! You're doing well! 👏"
            : score >= currentQuiz.questions.length * 0.6
              ? "Good effort! Keep practicing! 👍"
              : "Keep studying and try again! 💪"}
      </StyledText>

      <StyledTouchableOpacity onPress={() => resetQuiz()} className="bg-indigo-600 px-6 py-3 rounded-xl">
        <StyledText className="text-white font-medium">Try Again</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  )

  return (
    <StyledView className="flex-1 bg-gray-50 px-4 pt-4">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        placeholder="Search quiz category..."
      />

      <StyledView className="flex-row justify-between items-center mt-6 mb-4">
        <StyledText className="text-xl font-bold text-gray-800">{currentQuiz?.title || "Daily Quiz"}</StyledText>

        <StyledView className="bg-indigo-100 rounded-full px-3 py-1">
          <StyledText className="text-indigo-700 text-xs font-medium">{currentQuiz?.category || "General"}</StyledText>
        </StyledView>
      </StyledView>

      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </StyledView>
      ) : (
        <StyledScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {quizCompleted ? renderQuizComplete() : renderQuestion()}
        </StyledScrollView>
      )}
    </StyledView>
  )
}

export default QuizScreen
