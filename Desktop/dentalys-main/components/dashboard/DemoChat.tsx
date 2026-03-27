// components/dashboard/DemoChat.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Info } from 'lucide-react'

interface DemoChatProps {
  hasContent: boolean
  channel: 'telegram'
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function DemoChat({ hasContent, channel }: DemoChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Fresh session ID per page load — prevents stale thread history/status from prior demo sessions
  const sessionId = useRef(crypto.randomUUID())

  const channelColor = '#229ED9'

  useEffect(() => {
    if (hasContent) {
      sendMessage('Hello')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), sessionId: sessionId.current }),
      })
      const data = await res.json()
      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Something went wrong. Please try again.',
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!hasContent) {
    return (
      <div
        className="flex h-96 flex-col items-center justify-center rounded-2xl bg-white text-center"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <Info className="mb-3 h-8 w-8 text-stone-300" />
        <p className="text-[14px] font-medium text-stone-600">
          Add services and FAQ first
        </p>
        <p className="mt-1 text-[13px] text-stone-400">
          The AI needs content to generate responses.
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex h-96 flex-col rounded-2xl bg-white"
      style={{ border: '0.5px solid #e7e5e4' }}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-md text-white'
                  : 'rounded-bl-md bg-white text-stone-700'
              }`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: channelColor }
                  : { border: '0.5px solid #e7e5e4' }
              }
            >
              {msg.role === 'assistant' && (
                <p className="mb-1 text-[10px] font-medium text-stone-400">
                  🤖 AI
                </p>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <span
                className="h-2 w-2 rounded-full bg-stone-400 animate-typingDot"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-stone-400 animate-typingDot"
                style={{ animationDelay: '200ms' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-stone-400 animate-typingDot"
                style={{ animationDelay: '400ms' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3"
        style={{ borderTop: '0.5px solid #e7e5e4' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border-0 bg-stone-50 px-3 py-2 text-[13px] focus:ring-0"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors disabled:opacity-40"
          style={{ backgroundColor: channelColor }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  )
}
