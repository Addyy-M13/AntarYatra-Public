// Demo Mode Configuration
// Set this to false when you want to use real authentication and database

export const DEMO_MODE = true

// Demo user data
export const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@antaryatra.com',
}

export const DEMO_PROFILE = {
  id: 'demo-user-123',
  display_name: 'Demo User',
  anonymous_name: 'HopefulJourney2024',
  total_points: 0,
  current_streak: 0,
  longest_streak: 0,
  privacy_mode: true,
}

// When DEMO_MODE is true:
// - No authentication required
// - Data is stored in browser localStorage
// - All features work but data is not persistent across devices
// - Great for testing and demos

// When DEMO_MODE is false:
// - Requires Supabase authentication
// - Data is stored in Supabase database
// - Data persists across devices
// - Requires database setup
