import React from 'react'
import Button from '@/components/ui/Button'
import { ShowConfirmationProps } from '@/types'

const ShowConfirmation = ({value,setShowConfirmation,handleClick,loading}:ShowConfirmationProps) => {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">Confirm Update</h2>
      <p className="mb-6">
        Are you sure you want to set the fee to{" "}
        <span className="font-semibold">{value}%</span>?
      </p>
      <div className="flex justify-end gap-3">
        <Button
          othercss="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"

          handleClick={() => setShowConfirmation(false)} title={"cencel"}/>
        <Button
          othercss="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          handleClick={handleClick}
          title="confirm"
          loading={loading}
        />
      </div>
    </div>
  </div>
  )
}

export default ShowConfirmation