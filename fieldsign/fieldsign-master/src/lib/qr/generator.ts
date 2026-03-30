import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

// ============================================================
// GENERATE QR TOKEN
// ============================================================
export function generateQrToken(): string {
  // 32 random bytes hex = 64 char string
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ============================================================
// GENERATE QR CODE DATA URL (for display in browser)
// ============================================================
export async function generateQrDataUrl(token: string, appUrl: string): Promise<string> {
  const url = `${appUrl}/tech?token=${token}`
  const dataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#1e3a5f',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  })
  return dataUrl
}

// ============================================================
// GENERATE QR CODE AS BUFFER (for storage)
// ============================================================
export async function generateQrBuffer(token: string, appUrl: string): Promise<Buffer> {
  const url = `${appUrl}/tech?token=${token}`
  const buffer = await QRCode.toBuffer(url, {
    width: 400,
    margin: 3,
    color: {
      dark: '#1e3a5f',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  })
  return buffer
}

// ============================================================
// BUILD TECH URL FROM TOKEN
// ============================================================
export function buildTechUrl(token: string, appUrl: string): string {
  return `${appUrl}/tech?token=${token}`
}
