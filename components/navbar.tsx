import React from 'react'
import { Button } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'
import { useState, useEffect } from 'react'
import { getApiLimitCount } from '@/lib/api-limit'

export default async function Navbar() {
  const apiLimitCount = await getApiLimitCount()
  
  return (
    <div className='flex items-center p-4'>
        <MobileSidebar apiLimitCount={apiLimitCount} />
        <div className='flex w-full justify-end'>
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}
