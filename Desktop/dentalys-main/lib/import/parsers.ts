// lib/import/parsers.ts
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { ParsedCustomer, ParseResult, FieldMapping } from '@/types'

function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
  if (cleaned && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  return cleaned || undefined
}

function normalizeTags(tags: string | string[] | undefined): string[] | undefined {
  if (!tags) return undefined
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean)
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function normalizeFirstTime(val: unknown): boolean | undefined {
  if (val === undefined || val === null || val === '') return undefined
  if (typeof val === 'boolean') return val
  const str = String(val).toLowerCase().trim()
  if (['true', 'yes', '1'].includes(str)) return true
  if (['false', 'no', '0'].includes(str)) return false
  return undefined
}

function validateRecord(
  record: ParsedCustomer,
  rowNum: number
): string | null {
  if (!record.name || record.name.trim().length < 2) {
    return `Row ${rowNum}: Name is required and must be at least 2 characters`
  }
  if (record.phone && !/^\+\d{8,15}$/.test(record.phone)) {
    return `Row ${rowNum}: Invalid phone format. Use E.164 format (e.g., +14155551234)`
  }
  if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    return `Row ${rowNum}: Invalid email format`
  }
  return null
}

function applyFieldMap(
  raw: Record<string, string>,
  fieldMap: FieldMapping,
  rowNum: number
): ParsedCustomer {
  const record: ParsedCustomer = {
    _row_number: rowNum,
    _raw: raw,
  }

  for (const [header, mapping] of Object.entries(fieldMap)) {
    if (mapping === 'skip') continue
    const value = raw[header]
    if (value === undefined || value === '') continue

    switch (mapping) {
      case 'name':
        record.name = value.trim()
        break
      case 'phone':
        record.phone = normalizePhone(value)
        break
      case 'email':
        record.email = value.trim().toLowerCase()
        break
      case 'notes':
        record.notes = value.trim()
        break
      case 'tags':
        record.tags = normalizeTags(value)
        break
      case 'is_first_time':
        record.is_first_time = normalizeFirstTime(value)
        break
    }
  }

  return record
}

export function parseCSV(
  content: string,
  fieldMap: FieldMapping
): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  const records: ParsedCustomer[] = []
  const errors: Array<{ row: number; message: string }> = []

  parsed.data.forEach((row, index) => {
    const rowNum = index + 2 // +2 for header row + 0-index
    const record = applyFieldMap(row, fieldMap, rowNum)
    const error = validateRecord(record, rowNum)
    if (error) {
      errors.push({ row: rowNum, message: error })
    } else {
      records.push(record)
    }
  })

  return { records, errors, total: parsed.data.length }
}

export function parseExcel(
  buffer: ArrayBuffer,
  fieldMap: FieldMapping
): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: '',
  })

  const records: ParsedCustomer[] = []
  const errors: Array<{ row: number; message: string }> = []

  data.forEach((row, index) => {
    const rowNum = index + 2
    const stringRow: Record<string, string> = {}
    for (const [key, val] of Object.entries(row)) {
      stringRow[key] = String(val)
    }
    const record = applyFieldMap(stringRow, fieldMap, rowNum)
    const error = validateRecord(record, rowNum)
    if (error) {
      errors.push({ row: rowNum, message: error })
    } else {
      records.push(record)
    }
  })

  return { records, errors, total: data.length }
}

export function parseVCF(content: string): ParseResult {
  const cards = content.split(/BEGIN:VCARD/i).filter((c) => c.trim())
  const records: ParsedCustomer[] = []
  const errors: Array<{ row: number; message: string }> = []

  cards.forEach((card, index) => {
    const rowNum = index + 1
    const lines = card.split('\n').map((l) => l.trim())

    const getValue = (prefix: string): string | undefined => {
      const line = lines.find((l) =>
        l.toUpperCase().startsWith(prefix.toUpperCase())
      )
      if (!line) return undefined
      const parts = line.split(':')
      parts.shift()
      return parts.join(':').trim() || undefined
    }

    const record: ParsedCustomer = {
      name: getValue('FN'),
      phone: normalizePhone(getValue('TEL')),
      email: getValue('EMAIL'),
      notes: getValue('NOTE'),
      _row_number: rowNum,
      _raw: { vcard: card },
    }

    const error = validateRecord(record, rowNum)
    if (error) {
      errors.push({ row: rowNum, message: error })
    } else {
      records.push(record)
    }
  })

  return { records, errors, total: cards.length }
}

export function parseJSON(content: string): ParseResult {
  const parsed = JSON.parse(content)
  const arr: Array<Record<string, unknown>> = Array.isArray(parsed)
    ? parsed
    : parsed.customers || []

  const records: ParsedCustomer[] = []
  const errors: Array<{ row: number; message: string }> = []

  arr.forEach((item, index) => {
    const rowNum = index + 1
    const record: ParsedCustomer = {
      name: item.name ? String(item.name).trim() : undefined,
      phone: normalizePhone(item.phone ? String(item.phone) : undefined),
      email: item.email ? String(item.email).trim().toLowerCase() : undefined,
      notes: item.notes ? String(item.notes).trim() : undefined,
      tags: normalizeTags(item.tags as string | string[] | undefined),
      is_first_time: normalizeFirstTime(item.is_first_time),
      _row_number: rowNum,
      _raw: Object.fromEntries(
        Object.entries(item).map(([k, v]) => [k, String(v)])
      ),
    }

    const error = validateRecord(record, rowNum)
    if (error) {
      errors.push({ row: rowNum, message: error })
    } else {
      records.push(record)
    }
  })

  return { records, errors, total: arr.length }
}

export function autoDetectMapping(headers: string[]): FieldMapping {
  const mapping: FieldMapping = {}

  for (const header of headers) {
    const lower = header.toLowerCase().trim()

    if (['name', 'full name', 'full_name', 'patient name', 'patient_name', 'client name', 'client_name'].includes(lower)) {
      mapping[header] = 'name'
    } else if (['phone', 'mobile', 'tel', 'telephone', 'contact', 'phone_number', 'phone number', 'mobile number'].includes(lower)) {
      mapping[header] = 'phone'
    } else if (['email', 'e-mail', 'email address', 'email_address'].includes(lower)) {
      mapping[header] = 'email'
    } else if (['notes', 'note', 'comments', 'remarks', 'comment'].includes(lower)) {
      mapping[header] = 'notes'
    } else if (['tags', 'tag', 'label', 'labels', 'category', 'categories', 'type'].includes(lower)) {
      mapping[header] = 'tags'
    } else if (['first time', 'first_time', 'is_first_time', 'is first time', 'new patient', 'new_patient', 'new'].includes(lower)) {
      mapping[header] = 'is_first_time'
    } else {
      mapping[header] = 'skip'
    }
  }

  return mapping
}
