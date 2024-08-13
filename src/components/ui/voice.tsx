import React, { MouseEventHandler } from 'react'

type Props = {
  onClick: MouseEventHandler<HTMLDivElement | undefined>
  className?: string
}

const Voice: React.FC<Props> = ({ onClick, className }) => {
  return (
    <div onClick={onClick} className={`flex justify-center items-center space-x-1 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{ animationDuration: `${400 + i * 50}ms` }}
          className={`w-1 rounded-lg bg-slate-500 animate-sound`}
        ></div>
      ))}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{ animationDuration: `${400 + i * 20}ms` }}
          className={`w-1 rounded-lg bg-slate-500 animate-sound`}
        ></div>
      ))}
    </div>
  )
}
export default Voice
