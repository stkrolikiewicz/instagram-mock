import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Credentials } from '@/types'
import type { User } from '@/types'

export const useUserStore = defineStore('users', () => {
  const user = ref<User | null>(null)
  const errorMessage = ref('')
  const successMessage = ref('')
  const infoMessage = ref('')
  const loading = ref(false)
  const loadingUser = ref(false)

  const handleLogin = async (credentials: Credentials) => {
    const { email, password } = credentials

    loading.value = true

    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.user) {
          user.value = {
            id: res?.user.id,
            email: res?.user.email,
            username: res?.user.username,
          }
        }
        res.error ? errorMessage.value = res.message : successMessage.value = res.message
        loading.value = false
      })
  }

  const handleSignup = async (credentials: Credentials) => {
    const { email, password, username } = credentials

    loading.value = true
    errorMessage.value = ''

    await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.user) {
          user.value = {
            id: res?.user.id,
            email: res?.user.email,
            username: res?.user.username,
          }
        }
        if (res.error) errorMessage.value = res.message
        else {
          successMessage.value = res.message
          infoMessage.value = 'You\'re logged in.'
        }
        loading.value = false
      })
  }

  const handleLogout = async () => {
    loading.value = true

    await fetch('/api/logout')
      .then(res => res.json())
      .then(res => {
        if (res.error) errorMessage.value = res.message
        else {
          successMessage.value = res.message
          user.value = null
        }
        loading.value = false
      })
  }

  const getUser = async () => {
    loadingUser.value = true
    await fetch('/api/getUser')
      .then(res => res.json())
      .then(res => {
        if (res.user) {
          user.value = {
            id: res?.user.id,
            email: res?.user.email,
            username: res?.user.username,
          }
        } else user.value = null
        loadingUser.value = false
      })
  }
  
  // const deleteUser = async () => {
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
