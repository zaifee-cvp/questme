// app/dashboard/conversations/page.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Send, Smartphone, MessageSquare } from 'lucide-react'
import type { ConversationThread, ConversationLog, Customer } from '@/types'

interface ThreadWithCustomer extends ConversationThread {
  customers: Pick<Customer, 'name' | 'phone'>[] | null
}

function isToolMessage(msg: ConversationLog): boolean {
  if (msg.role === 'tool') return true
  if ((msg as ConversationLog & { tool_name?: string | null }).tool_name) return true
  const content = (msg.content || '').trim()
  if (content.startsWith('{') || content.startsWith('[')) {
    try { JSON.parse(content); return true } catch { /* not JSON */ }
  }
  return false
}

export default function ConversationsPage() {
  const supabase = createClient()
  const [threads, setThreads] = useState<ThreadWithCustomer[]>([])
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConversationLog[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showDemo, setShowDemo] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadThreads = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return

    setBusinessId(profile.business_id)

    const { data } = await supabase
      .from('conversation_threads')
      .select('*, customers(name, phone)')
      .eq('business_id', profile.business_id)
      .order('updated_at', { ascending: false })

    if (data) setThreads(data as ThreadWithCustomer[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadThreads()
  }, [loadThreads])

  // Realtime: refresh thread list when customer_id or other fields update after a booking
  useEffect(() => {
    if (!businessId) return
    const channel = supabase
      .channel(`threads-${businessId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversation_threads', filter: `business_id=eq.${businessId}` },
        () => { loadThreads() }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [businessId, supabase, loadThreads])

  useEffect(() => {
    if (!selectedThread) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('conversation_logs')
        .select('*')
        .eq('thread_id', selectedThread)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }

    loadMessages()

    // Realtime: refresh messages when new logs arrive for this thread
    const channel = supabase
      .channel(`logs-${selectedThread}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversation_logs', filter: `thread_id=eq.${selectedThread}` },
        () => { loadMessages() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedThread, supabase])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || !selectedThread || sending) return
    setSending(true)

    try {
      const res = await fetch('/api/conversations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: selectedThread,
          message: reply.trim(),
        }),
      })
      if (res.ok) {
        setReply('')
        const { data } = await supabase
          .from('conversation_logs')
          .select('*')
          .eq('thread_id', selectedThread)
          .order('created_at', { ascending: true })
        if (data) setMessages(data)
      }
    } finally {
      setSending(false)
    }
  }

  const filteredThreads = threads.filter((t) => {
    if (!showDemo && t.telegram_chat_id?.startsWith('demo_')) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.customers?.[0]?.name?.toLowerCase().includes(q) ||
      t.customers?.[0]?.phone?.toLowerCase().includes(q) ||
      t.channel.includes(q)
    )
  })

  const activeThread = threads.find((t) => t.id === selectedThread)

  return (
    <div
      className="flex h-[calc(100vh-120px)] rounded-2xl bg-white overflow-hidden"
      style={{ border: '0.5px solid #e7e5e4' }}
    >
      {/* Left panel — Thread list */}
      <div
        className="flex w-80 shrink-0 flex-col"
        style={{ borderRight: '0.5px solid #e7e5e4' }}
      >
        <div className="p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-stone-50 py-2 pl-9 pr-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
              style={{ border: '0.5px solid #e7e5e4' }}
            />
          </div>
          <button
            onClick={() => setShowDemo((v) => !v)}
            className={`w-full rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              showDemo
                ? 'bg-amber-50 text-amber-700'
                : 'bg-stone-50 text-stone-400 hover:text-stone-600'
            }`}
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            {showDemo ? 'Hiding demo sessions' : 'Show demo sessions'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {loading ? (
            <p className="p-4 text-center text-[13px] text-stone-400">
              Loading...
            </p>
          ) : filteredThreads.length === 0 ? (
            <p className="p-4 text-center text-[13px] text-stone-400">
              No conversations yet
            </p>
          ) : (
            filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                  selectedThread === thread.id
                    ? 'bg-amber-50'
                    : 'hover:bg-stone-50'
                }`}
                style={{ borderBottom: '0.5px solid #e7e5e4' }}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
                    thread.channel === 'whatsapp'
                      ? 'bg-[#25D366]'
                      : 'bg-[#229ED9]'
                  }`}
                >
                  {thread.channel === 'whatsapp' ? (
                    <Smartphone className="h-3.5 w-3.5" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-medium text-stone-800">
                    {thread.customers?.[0]?.name || 'Unknown'}
                  </p>
                  <p className="truncate text-[12px] text-stone-400">
                    {thread.customers?.[0]?.phone || thread.telegram_chat_id || 'N/A'}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    thread.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : thread.status === 'handed_off'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {thread.status}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel — Messages */}
      <div className="flex flex-1 flex-col">
        {selectedThread && activeThread ? (
          <>
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: '0.5px solid #e7e5e4' }}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                  activeThread.channel === 'whatsapp'
                    ? 'bg-[#25D366]'
                    : 'bg-[#229ED9]'
                }`}
              >
                {activeThread.channel === 'whatsapp' ? (
                  <Smartphone className="h-3.5 w-3.5" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-medium text-stone-800">
                  {activeThread.customers?.[0]?.name || 'Unknown'}
                </p>
                <p className="text-[11px] capitalize text-stone-400">
                  {activeThread.channel} &middot; {activeThread.status}
                </p>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin"
            >
              {messages.filter((msg) => !isToolMessage(msg)).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-bl-md bg-stone-100 text-stone-700'
                        : 'rounded-br-md bg-amber-50 text-stone-700'
                    }`}
                  >
                    <p className="mb-0.5 text-[10px] font-medium text-stone-400">
                      {msg.role === 'user' ? 'Customer' : 'AI'}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 p-3"
              style={{ borderTop: '0.5px solid #e7e5e4' }}
            >
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 rounded-lg bg-stone-50 px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-stone-300" />
              <p className="text-[14px] font-medium text-stone-600">
                Select a conversation
              </p>
              <p className="mt-1 text-[13px] text-stone-400">
                Choose a thread from the left to view messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
