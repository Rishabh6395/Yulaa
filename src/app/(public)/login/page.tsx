import { LoginForm } from '@/components/ui/login-form'
import React from 'react'

const login = () => {
  return (
    <div className='text-white bg-zinc-900 p-10 min-h-screen'>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
    </div>
  )
}

export default login
