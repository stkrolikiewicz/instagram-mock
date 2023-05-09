import { supabase } from './supabase'
exports.handler = async event => {
  const { followerId, followingId }= JSON.parse(event.body)

  await supabase.from('followers_following').delete(
  )
    .eq('follower_id', followerId)
    .eq('following_id',followingId)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'User unfollowed successfully',
      },
    ),
  }
}