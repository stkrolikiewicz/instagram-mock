import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Credentials } from '@/types'
import { supabase }from '../supabase'
import type { User } from '@/types'

export const useUserStore = defineStore('users', () => {
  const user = ref<User | null>(null)
  const errorMessage = ref('')
  const successMessage = ref('')
  const infoMessage = ref('')
  const loading = ref(false)
  const loadingUser = ref(false)

  const validateEmail = (email: string) => email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  const handleLogin = async (credentials: Credentials) => {

    const { email, password } = credentials

    if(!validateEmail(email)) {
      loading.value = false
      return errorMessage.value = 'Email is invalid'
    }

    if(!password.length) {
      loading.value = false
      return errorMessage.value = 'Password cannot be empty!'
    }

    loading.value = true

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      loading.value = false
      return errorMessage.value = error.message
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()

    user.value = {
      id: existingUser?.id,
      email: existingUser?.email,
      username: existingUser?.username,
    }

    loading.value = false
    successMessage.value = 'You\'ve logged in successfully!'
  }
  const handleSignup = async (credentials: Credentials) => {
    const { email, password, username } = credentials

    if (password.length < 6) {
      loading.value = false
      return errorMessage.value = 'Password length is too short'
    }
    if (username && username.length < 4) {
      loading.value = false
      return errorMessage.value = 'Username length is too short'
    }
    if (!validateEmail(email)) {
      loading.value = false
      return errorMessage.value = 'Email is invalid'
    }

    loading.value = true
    errorMessage.value = ''

    const { data: userWithUsername } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .single()

    if (userWithUsername) {
      loading.value = false
      return errorMessage.value = 'User already registered'
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      loading.value = false
      return errorMessage.value = error.message
    }


    await supabase.from('users').insert({
      username,
      email,
    },
    )

    const { data: newUser } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()

    user.value = {
      id: newUser?.id,
      email: newUser?.email,
      username: newUser?.username,
    }

    loading.value = false
    successMessage.value = 'You\'ve signed up successfully!'
    infoMessage.value = 'You\'re logged in.'
  }
  const handleLogout = async () => {
    loading.value = true
    const { error } = await supabase.auth.signOut()

    if (error) {
      loading.value = false
      return errorMessage.value = error.message
    }
    user.value = null
    loading.value = false
    successMessage.value = 'You\'ve logged out successfully!'
  }

  const getUser = async () => {
    loadingUser.value = true
    const { data } = await supabase.auth.getUser()

    if(!data.user) {
      loadingUser.value = false
      return user.value = null
    }

    const { data: userWithEmail } = await supabase
      .from('users')
      .select()
      .eq('email', data.user?.email)
      .single()
      
    user.value = {
      username: userWithEmail?.username,
      email: userWithEmail?.email,
      id: userWithEmail?.id,
    }

    loadingUser.value = false
  }
  
  // const deleteUser = async (id: string) => {
  //   const { data, error } = await supabase.auth.admin.deleteUser(id)
  //   console.log(toRaw({ data, error }))
  // }  

  return { 
    user,
    errorMessage,
    successMessage,
    infoMessage,
    loading,
    loadingUser,
    handleLogin,
    handleLogout,
    handleSignup,
    getUser,
    // deleteUser,
  }
})
