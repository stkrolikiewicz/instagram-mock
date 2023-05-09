import { supabase } from './supabase'
exports.handler = async event => {
  const { userId }= JSON.parse(event.body)
  
  const { count } = await supabase
    .from('followers_following')
    .select('*', { count: 'exact' })
    .eq('follower_id', userId)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        count: count,
      },
    ),
  }
}