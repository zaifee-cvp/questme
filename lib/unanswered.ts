type ChatRow = {
  role: string
  content: string
  is_answered: boolean | null
  session_id: string
  created_at: string
}

/**
 * The question behind each failed reply, oldest first. Expects rows ordered by
 * created_at ascending.
 *
 * Reports the QUESTION that failed, not the fallback text, which is identical
 * every time and tells the customer nothing.
 *
 * The chat route writes a question and its reply in one insert, so both rows
 * carry the identical created_at and ordering by time cannot say which came
 * first — "the previous user row" would often be the question before. Pair on
 * session and timestamp instead, and fall back to the nearest earlier question
 * in the session only for a row written some other way.
 */
export function failedQuestions(rows: ChatRow[]): string[] {
  const questionAt = new Map<string, string>()
  for (const m of rows) {
    if (m.role === 'user') questionAt.set(`${m.session_id}|${m.created_at}`, m.content)
  }

  const questions: string[] = []
  rows.forEach((m, i) => {
    if (m.role !== 'assistant' || m.is_answered) return
    let question = questionAt.get(`${m.session_id}|${m.created_at}`)
    for (let j = i - 1; question === undefined && j >= 0; j--) {
      if (rows[j].session_id === m.session_id && rows[j].role === 'user') question = rows[j].content
    }
    if (question !== undefined) questions.push(question)
  })
  return questions
}
