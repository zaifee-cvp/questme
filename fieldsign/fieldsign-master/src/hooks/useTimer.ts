'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  durationSeconds: number
  onExpire?: () => void
  autoStart?: boolean
}

interface TimerState {
  secondsLeft: number
  isRunning: boolean
  isExpired: boolean
  formattedTime: string
  percentageLeft: number
  start: () => void
  pause: () => void
  reset: () => void
  extend: (additionalSeconds: number) => void
}

export function useTimer({ durationSeconds, onExpire, autoStart = false }: UseTimerOptions): TimerState {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isExpired, setIsExpired] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setIsExpired(true)
            onExpireRef.current?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [])

  const start = useCallback(() => {
    if (!isExpired) setIsRunning(true)
  }, [isExpired])

  const pause = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsExpired(false)
    setSecondsLeft(durationSeconds)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [durationSeconds])

  const extend = useCallback((additionalSeconds: number) => {
    setSecondsLeft(prev => prev + additionalSeconds)
    setIsExpired(false)
    setIsRunning(true)
  }, [])

  return {
    secondsLeft,
    isRunning,
    isExpired,
    formattedTime: formatTime(secondsLeft),
    percentageLeft: Math.max(0, (secondsLeft / durationSeconds) * 100),
    start,
    pause,
    reset,
    extend,
  }
}
