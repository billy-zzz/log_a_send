'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import type { PanInfo } from 'framer-motion'

const ITEM_W = 80

interface GradePickerProps {
  grades: { grade: string; score: number }[]
  onChange: (grade: string, score: number) => void
}

export function GradePicker({ grades, onChange }: GradePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [idx, setIdx] = useState(0)
  const [bounds, setBounds] = useState({ left: -9999, right: 9999 })

  useLayoutEffect(() => {
    const W = containerRef.current?.offsetWidth ?? 320
    const center = W / 2 - ITEM_W / 2
    x.set(center)
    setBounds({ left: center - (grades.length - 1) * ITEM_W, right: center })
    setIdx(0)
  }, [grades])

  function snapTo(i: number) {
    const W = containerRef.current?.offsetWidth ?? 320
    const center = W / 2 - ITEM_W / 2
    const clamped = Math.max(0, Math.min(grades.length - 1, i))
    setIdx(clamped)
    animate(x, center - clamped * ITEM_W, { type: 'spring', stiffness: 400, damping: 40 })
    onChange(grades[clamped].grade, grades[clamped].score)
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const W = containerRef.current?.offsetWidth ?? 320
    const center = W / 2 - ITEM_W / 2
    const projected = x.get() + info.velocity.x * 0.08
    snapTo(Math.round((center - projected) / ITEM_W))
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden h-24 select-none">
      <div className="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 w-20 rounded-xl border-2 border-orange-500 bg-orange-500/10" />
      <motion.div
        drag="x"
        dragConstraints={bounds}
        style={{ x }}
        onDragEnd={handleDragEnd}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
        className="flex items-center h-full cursor-grab active:cursor-grabbing"
      >
        {grades.map(({ grade, score }, i) => (
          <motion.button
            key={grade}
            type="button"
            onClick={() => snapTo(i)}
            animate={{
              scale: i === idx ? 1.2 : 0.75,
              opacity: Math.max(0.2, 1 - Math.abs(i - idx) * 0.3),
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`w-20 flex-shrink-0 h-full flex items-center justify-center font-display font-bold text-xl ${
              i === idx ? 'text-white' : 'text-neutral-500'
            }`}
          >
            {grade}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
