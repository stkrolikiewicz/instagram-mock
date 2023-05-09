import { supabase } from './supabase'
exports.handler = async event => {
  const { userId, loggedInUserId } = JSON.parse(event.body)
  let isFollowing
  
  const { data } = await supabase
    .from('followers_following')
    .select()
    .eq('follower_id', loggedInUserId)
    .eq('following_id', userId)
    .single()
  
  data ? isFollowing = true : isFollowing = false
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        isFollowing: isFollowing,
      },
    ),
  }
}