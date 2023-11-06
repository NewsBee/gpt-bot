"use client"

import React from 'react'
import { Button } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div className='flex items-center p-4'>
        <MobileSidebar/>
        <div className='flex w-full justify-end'>
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}
