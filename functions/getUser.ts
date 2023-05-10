import { supabase } from './supabase'
exports.handler = async () => {
  let statusCode, statusText, existingUser
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    statusCode = error.status
    statusText = error.message
    existingUser = undefined
  } else {
    await supabase
      .from('users')
      .select()
      .eq('email', data.user?.email)
      .single()
      .then(res => existingUser = res.data)
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify(
      {
        error: error,
        message: statusText,
        user: existingUser,
      },
    ),
  }
}