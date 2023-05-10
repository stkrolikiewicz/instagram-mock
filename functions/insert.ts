// Grab our credentials from a .env file or environment variables
import { supabase } from './supabase'
// Our standard serverless handler function
exports.handler = async event => {
  // Insert a row
  const { status, statusText } = await supabase
    .from('some_table')
    .insert([{ some_column: event.body }])
    
  return {
    statusCode: status,
    body: statusText,
  }
}
