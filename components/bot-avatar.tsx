import React from 'react'
import { Avatar } from './ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

export default function BotAvatar() {
  return (
    <div>
        <Avatar className='h-8 w-8'>
            <AvatarImage className='p-1' src="/logo.png" />
        </Avatar>
    </div>
  )
}
