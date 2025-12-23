import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  )

  useEffect(() => {
    const root = window.document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    localStorage.setItem("theme", theme)
  }, [theme])

  return (
 <button
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
  className="
    fixed top-[2px] right-5 z-50
    flex items-center gap-2
    px-4 py-2
    rounded-full
    text-sm font-medium

    bg-white/80 text-gray-900
    backdrop-blur-md
    border border-gray-200
    shadow-lg

    hover:shadow-xl hover:scale-105
    active:scale-95

    dark:bg-gray-900/80
    dark:text-gray-100
    dark:border-gray-700

    transition-all duration-300 ease-out
  "
>
  <span className="text-lg">
    {theme === "light" ? "🌙" : "☀️"}
  </span>
  <span className="hidden sm:inline">
    {theme === "light" ? "Dark" : "Light"}
  </span>
</button>

  )
}
