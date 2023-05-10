import { supabase } from './supabase'
exports.handler = async event => {
  const { userId, lastCardIndex, postsPerSet } = JSON.parse(event.body)


  const { error: firstError, data: following } = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', userId)

  if (firstError) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error: firstError,
          message: firstError.message,
          data: {
            posts: null,
          },
        },
      ),
    }
  }

  const owners_ids: number[] = following?.map(f => f.following_id) || []

  const { error, data: posts } = await supabase
    .from('posts')
    .select()
    .in('owner_id', owners_ids)
    .range(lastCardIndex - postsPerSet - 1,lastCardIndex)
    .order('created_at', { ascending: false })

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error: error,
          message:error.message,
          data: {
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
          posts: posts,
        },
      },
    ),
  }
}