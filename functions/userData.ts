import { supabase } from './supabase'
exports.handler = async event => {
  const { username } = JSON.parse(event.body)

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()

  if (userError) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error: userError,
          message: userError.message,
          data: {
            user: undefined,
            posts: null,
          },
        },
      ),
    }
  }


  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select()
    .eq('owner_id', userData.id)
    .order('created_at', { ascending: false })

  if (postsError) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error: postsError,
          message: postsError.message,
          data: {
            user: userData,
            posts: null,
          },
        },
      ),
    }
  }


  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        error: null,
        message: 'Data fetched successfully',
        data: {
          user: userData,
          posts: postsData,
        },
      },
    ),
  }
}