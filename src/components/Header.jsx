import React, { useEffect, useState } from 'react'

export const Header = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved) return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  return (
    <div className='header'>
        <h1 className='title'>Notes</h1>
        <button
          className='rounded-xl bg-white/50 px-3 py-1.5 font-bold text-sm'
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
    </div>
  )
}