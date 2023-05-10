// Grab our credentials from a .env file or environment variables
require('dotenv').config()
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
} = process.env

// Connect to our database 
const { createClient } = require('@supabase/supabase-js')
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)


// {
//   auth: {
//     persistSession: true,
//   },
// }