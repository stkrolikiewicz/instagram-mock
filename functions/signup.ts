import { supabase } from './supabase'

exports.handler = async event => {
  let statusCode, statusText, existingUser, error

  const { username, email, password } = JSON.parse(event.body)

  const { data: userWithUsername } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()

  const { data: userWithEmail } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single()

  if (userWithUsername || userWithEmail) {
    error = {
      status: 400,
      message: 'User already created!',
    }
  } else {
    const { error: sbError } = await supabase.auth.signUp({
      email,
      password,
    })
  
    if (sbError) {
      error = { ...sbError }
    } else {
      statusCode = 200
      statusText = 'You\'ve signed up successfully!'
      await supabase.from('users').insert({
        username,
        email,
      },
      )
  
      await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single()
        .then(res => existingUser = res.data)
    }
  }

  if (error) {
    statusCode = error.status
    statusText = error.message
    existingUser = undefined
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