import { supabase } from './supabase'
exports.handler = async event => {
  let statusCode, statusText, existingUser

  const { email, password } = JSON.parse(event.body)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    statusCode = error.status
    statusText = error.message
    existingUser = undefined
  }

  else if (data) {
    statusCode = 200
    statusText = 'You\'ve logged in successfully!'
    await supabase
      .from('users')
      .select()
      .eq('email', email)
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