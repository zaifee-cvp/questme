'use client'

import { useState } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui'

const EXTENSION_REASONS = [
  'Cannot locate client',
  'Client unavailable',
  'Waiting for signature',
  'Verifying details',
  'Network issue',
  'Other',
]

interface TimerDisplayProps {
  durationMinutes: number
  extensionMinutes: number
  requireReason: boolean
  onExpire: () => void
  onExtension: (reason: string, extraNote: string, minutes: number) => void
}

export function TimerDisplay({
  durationMinutes,
  extensionMinutes,
  requireReason,
  onExpire,
  onExtension,
}: TimerDisplayProps) {
  const [extensionModalOpen, setExtensionModalOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [otherNote, setOtherNote] = useState('')
  const [hasExtended, setHasExtended] = useState(false)
  const [expiredBannerShown, setExpiredBannerShown] = useState(false)

  const timer = useTimer({
    durationSeconds: durationMinutes * 60,
    autoStart: true,
    onExpire: () => {
      setExpiredBannerShown(true)
      onExpire()
    },
  })

  const handleRequestExtension = () => {
    setSelectedReason('')
    setOtherNote('')
    setExtensionModalOpen(true)
  }

  const confirmExtension = () => {
    if (requireReason && !selectedReason) return
    const note = selectedReason === 'Other' ? otherNote : selectedReason
    timer.extend(extensionMinutes * 60)
    setHasExtended(true)
    setExpiredBannerShown(false)
    setExtensionModalOpen(false)
    onExtension(selectedReason, otherNote, extensionMinutes)
  }

  const isWarning = timer.secondsLeft <= 60 && timer.secondsLeft > 30 && !timer.isExpired
  const isCritical = timer.secondsLeft <= 30 && !timer.isExpired

  if (!timer.isRunning && !timer.isExpired && !hasExtended) return null

  return (
    <>
      {/* Timer Bar */}
      <div className={`rounded-xl p-3 mb-4 ${
        timer.isExpired ? 'bg-red-50 border border-red-200'
        : isCritical ? 'bg-red-50 border border-red-200'
        : isWarning ? 'bg-amber-50 border border-amber-200'
        : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {(isWarning || isCritical || timer.isExpired) ? (
              <AlertTriangle className={`h-4 w-4 ${timer.isExpired || isCritical ? 'text-red-500' : 'text-amber-500'}`} />
            ) : (
              <Clock className="h-4 w-4 text-blue-500" />
            )}
            <span className={`text-sm font-semibold ${
              timer.isExpired ? 'text-red-700'
              : isCritical ? 'text-red-700'
              : isWarning ? 'text-amber-700'
              : 'text-blue-700'
            }`}>
              {timer.isExpired ? 'Time Expired' : isCritical ? 'Hurry up!' : isWarning ? 'Almost done' : 'Time Remaining'}
            </span>
          </div>
          {!timer.isExpired && (
            <span className={`text-xl font-mono font-bold ${
              isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'
            }`}>
              {timer.formattedTime}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {!timer.isExpired && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${timer.percentageLeft}%` }}
            />
          </div>
        )}

        {/* Expired or warning message */}
        {timer.isExpired && !hasExtended && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-red-600">The report timer has expired. You can still submit, or request an extension to record the reason.</p>
            <button
              type="button"
              onClick={handleRequestExtension}
              className="text-xs font-semibold text-red-600 hover:text-red-800 underline"
            >
              Request Extension
            </button>
          </div>
        )}

        {hasExtended && (
          <p className="text-xs text-gray-500 mt-1">
            Extension granted: +{extensionMinutes} minutes
          </p>
        )}
      </div>

      {/* Extension Modal */}
      <Modal
        open={extensionModalOpen}
        onClose={() => setExtensionModalOpen(false)}
        title="Request Time Extension"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a reason for the extension. This will be recorded in the report.
          </p>
          <div className="space-y-2">
            {EXTENSION_REASONS.map(reason => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  selectedReason === reason
                    ? 'border-[#1e3a5f] bg-[#f0f4f9] text-[#1e3a5f] font-medium'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
          {selectedReason === 'Other' && (
            <input
              type="text"
              value={otherNote}
              onChange={e => setOtherNote(e.target.value)}
              placeholder="Briefly describe the reason..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            />
          )}
          {requireReason && !selectedReason && (
            <p className="text-xs text-red-500">Please select a reason to continue</p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setExtensionModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmExtension}
              disabled={requireReason && !selectedReason}
              className="flex-1"
            >
              Confirm Extension
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
