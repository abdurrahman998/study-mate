// This is a mock implementation for the Supabase client
// In a real app, you would use the actual Supabase client

const mockSupabase = {
  auth: {
    signUp: async ({ email, password }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful signup
      return {
        data: {
          user: { id: "mock-user-id", email },
        },
        error: null,
      }
    },
    signInWithPassword: async ({ email, password }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      return {
        data: {
          user: { id: "mock-user-id", email },
        },
        error: null,
      }
    },
    getSession: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock no existing session
      return {
        data: { session: null },
        error: null,
      }
    },
    onAuthStateChange: (callback) => {
      // Mock auth state change listener
      return {
        data: { subscription: { unsubscribe: () => {} } },
      }
    },
  },
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => {
        // Simulate API call
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: [], error: null })
          }, 500)
        })
      },
      order: (column, { ascending }) => {
        // Simulate API call
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: [], error: null })
          }, 500)
        })
      },
    }),
    insert: (data) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { id: "mock-id", ...data }, error: null })
        }, 500)
      })
    },
    update: (data) => ({
      eq: (column, value) => {
        // Simulate API call
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: { id: value, ...data }, error: null })
          }, 500)
        })
      },
    }),
    delete: () => ({
      eq: (column, value) => {
        // Simulate API call
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: { id: value }, error: null })
          }, 500)
        })
      },
    }),
  }),
}

export const supabase = mockSupabase
