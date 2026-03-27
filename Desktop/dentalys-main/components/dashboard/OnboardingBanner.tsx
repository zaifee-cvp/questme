"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

type OnboardingBannerProps = {
  hasService: boolean
  hasChannel: boolean
}

const steps = [
  {
    title: "Add your first service",
    description:
      "Tell your bot what you offer — just a name and price. You can add more later.",
    ctaLabel: "Add a service",
    ctaHref: "/dashboard/services",
  },
  {
    title: "Connect a messaging channel",
    description:
      "Connect Telegram. Your bot starts answering patients instantly.",
    ctaLabel: "Connect channel",
    ctaHref: "/dashboard/telegram",
  },
  {
    title: "Test your AI receptionist",
    description:
      "Send your bot a message. See it book appointments, quote prices, and handle enquiries on its own.",
    ctaLabel: "Open test chat",
    ctaHref: "/dashboard/telegram",
  },
] as const

export default function OnboardingBanner({
  hasService,
  hasChannel,
}: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(true)
  const [testSent, setTestSent] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const isDismissed =
      localStorage.getItem("Dentalys_onboarding_dismissed") === "true"
    const isTestSent =
      localStorage.getItem("Dentalys_test_sent") === "true"

    setDismissed(isDismissed)
    setTestSent(isTestSent)
    setMounted(true)
  }, [])

  const completed = [hasService, hasChannel, testSent]
  const completedCount = completed.filter(Boolean).length
  const allDone = completedCount === 3
  const remaining = 3 - completedCount
  const progressPercent = Math.round((completedCount / 3) * 100)

  // Auto-dismiss when all done
  useEffect(() => {
    if (!allDone || dismissed) return
    const timer = setTimeout(() => {
      localStorage.setItem("Dentalys_onboarding_dismissed", "true")
      setDismissed(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [allDone, dismissed])

  // Set expanded to first incomplete step whenever completion state changes
  useEffect(() => {
    if (!mounted) return
    const firstIncomplete = completed.findIndex((c) => !c)
    setExpandedIndex(firstIncomplete === -1 ? null : firstIncomplete)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasService, hasChannel, testSent, mounted])

  if (!mounted) return null
  if (dismissed) return null

  function handleDismiss() {
    localStorage.setItem("Dentalys_onboarding_dismissed", "true")
    setDismissed(true)
  }

  function handleStepClick(index: number) {
    if (completed[index]) return
    // Locked if any previous step is incomplete
    for (let i = 0; i < index; i++) {
      if (!completed[i]) return
    }
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  function isLocked(index: number) {
    for (let i = 0; i < index; i++) {
      if (!completed[i]) return true
    }
    return false
  }

  return (
    <div className="relative bg-white border border-blue-500 rounded-xl p-5">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-xs text-gray-400 bg-transparent border-none cursor-pointer"
      >
        Dismiss
      </button>

      {/* Header */}
      <p className="text-[15px] font-medium">Get your AI receptionist live</p>
      <p className="text-sm text-gray-400 mt-0.5">
        {allDone ? "All done!" : `${remaining} step${remaining > 1 ? "s" : ""} remaining`}
      </p>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full mt-3 mb-4">
        <div
          className="h-1 bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {allDone ? (
        <p className="text-sm font-medium text-green-600">
          Your AI receptionist is live.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {steps.map((step, i) => {
            const done = completed[i]
            const locked = isLocked(i)
            const active = !done && !locked
            const expanded = expandedIndex === i

            return (
              <div
                key={i}
                onClick={() => handleStepClick(i)}
                className={
                  done
                    ? "border border-green-500 rounded-lg bg-green-50 px-4 py-2"
                    : active
                    ? "border border-blue-500 rounded-lg bg-white p-4 cursor-pointer"
                    : "border border-gray-200 rounded-lg p-4 opacity-40"
                }
              >
                <div className="flex items-center gap-3">
                  {/* Circle */}
                  {done ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-blue-500 text-blue-500 text-xs flex items-center justify-center font-medium flex-shrink-0">
                      {i + 1}
                    </div>
                  )}

                  <span
                    className={
                      done
                        ? "text-sm text-gray-500"
                        : "text-sm font-medium text-gray-900"
                    }
                  >
                    {step.title}
                  </span>
                </div>

                {/* Expanded content — only for active, non-done, non-locked */}
                {!done && active && expanded && (
                  <div className="mt-3 ml-9">
                    <p className="text-sm text-gray-500 mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Link
                        href={step.ctaHref}
                        className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium"
                      >
                        {step.ctaLabel}
                      </Link>
                      <button className="border border-gray-300 text-gray-500 rounded-lg px-3 py-2 text-sm">
                        Need help? →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
