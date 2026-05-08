import React from 'react'

export default function SubHeader({title,subtitle}) {
  return (
    <div className='bg-green-100 dark:bg-gray-800 w-full p-2 rounded-lg'>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
            {subtitle}
        </p>
    </div>
  )
}
