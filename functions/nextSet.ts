import { supabase } from './supabase'
exports.handler = async event => {
  const { userId, lastCardIndex, postsPerSet } = JSON.parse(event.body)


  const { data: following } = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', userId)

  const owners_ids: number[] = following?.map(f => f.following_id) || []

  const { error, data: nextPosts } = await supabase
    .from('posts')
    .select()
    .in('owner_id', owners_ids)
    .range(lastCardIndex + 1 ,lastCardIndex + postsPerSet)
    .order('created_at', { ascending: false })

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error: error,
          message: error.message,
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
          nextPosts: nextPosts,
        },
      },
    ),
  }
}