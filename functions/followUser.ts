import { supabase } from './supabase'
exports.handler = async event => {
  const { followerId, followingId }= JSON.parse(event.body)

  await supabase
    .from('followers_following')
    .insert({
      follower_id: followerId,
      following_id: followingId,
    })

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'User followed successfully',
      },
    ),
  }
}