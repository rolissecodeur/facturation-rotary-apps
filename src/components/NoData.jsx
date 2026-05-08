import React from 'react'
import { FolderX } from 'lucide-react'

export default function NoData({message}) {
  return (
    <div className="py-1 text-center text-gray-500 dark:text-gray-400">
        <FolderX className="w-10 h-10 text-red-700 bg-red-300 rounded-full p-2 mx-auto" strokeWidth={1} />
        <p className="font-medium text-md mt-2  text-center">{message}</p>
    </div>
  )
}
