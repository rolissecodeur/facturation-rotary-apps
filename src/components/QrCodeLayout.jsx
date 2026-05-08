import React from 'react'

export default function QrCodeLayout({ children }) {
  return (
    <div className="relative w-full h-screen">
      {/* Image de fond */}
      {/* <img className="absolute inset-0 w-full h-full object-cover" src={bgImg} alt="" /> */}

      {/* Overlay sombre (optionnel pour lisibilité) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenu passé au layout */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-6">
        {children}
      </div>
    </div>
  )
}
