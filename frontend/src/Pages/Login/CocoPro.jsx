import React from 'react'
export function CocoPro({ className = '' }) {
  return (
    <div className={`font-bold ${className}`}>
      <div className="flex items-center justify-center">
        <div className="text-4xl text-center">
          <span className="text-amber-700">Coco</span>
          <span className="text-green-700">Pro</span>
        </div>
      </div>
      <div className="text-sm text-center mt-1">Coconut Processing System</div>
    </div>
  )
}
