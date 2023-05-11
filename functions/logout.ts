import { supabase } from './supabase'
exports.handler = async () => {
  let statusCode, statusText

  const { error } = await supabase.auth.signOut()

  if (error) {
    statusCode = error.status
    statusText = error.message
  } else {
    statusCode = 200
    statusText = 'You\'ve logged out succesfully!'
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify(
      {
        error: error,
        message: statusText,
      },
    ),
  }
}