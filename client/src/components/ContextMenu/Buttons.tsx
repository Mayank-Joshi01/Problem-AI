import React from 'react'

interface Props {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    InnerText: string[];
}
export default function Buttons({onClick,InnerText}:Props) {
  return (
    <div className='group inline-block relative'>
      <button
    onClick={(e) => onClick(e)}
    id='button'
    className="
      flex items-center gap-1
      px-3 py-2
      text-sm text-white
      rounded-md
      bg-[#2b2d31]
      hover:bg-[#3a3d42]
      transition
    "
  >
    {InnerText[0]}
    {/* Translate */}
  </button>
    
    <span id="Innertext" className='absolute hidden group-hover:block top-full left-0 mt-2 text-[12px] bg-[#2b2d31] rounded-md px-1 py-0.5 font-bold text-white'>
    {InnerText[1]}
    </span>

  </div>
  )
}
