(function () {
  var script = document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script')
      return scripts[scripts.length - 1]
    })()

  var botId = script.getAttribute('data-bot-id')
  if (!botId) return

  var BASE_URL = 'https://www.questme.ai'

  // Inject styles
  var style = document.createElement('style')
  style.textContent = [
    '#qm-bubble{position:fixed;bottom:24px;right:24px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:12px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '#qm-iframe-wrap{width:380px;height:600px;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.45);display:none;flex-direction:column}',
    '#qm-iframe-wrap.open{display:flex}',
    '#qm-iframe{width:100%;height:100%;border:none;display:block}',
    '#qm-toggle{width:56px;height:56px;border-radius:50%;background:#AAFF00;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(170,255,0,.35);transition:transform .2s}',
    '#qm-toggle:hover{transform:scale(1.08)}',
    '#qm-toggle svg{pointer-events:none}',
    '@media(max-width:440px){#qm-iframe-wrap{width:calc(100vw - 16px);height:calc(100vh - 90px);border-radius:12px}}'
  ].join('')
  document.head.appendChild(style)

  // Build DOM
  var bubble = document.createElement('div')
  bubble.id = 'qm-bubble'

  var iframeWrap = document.createElement('div')
  iframeWrap.id = 'qm-iframe-wrap'

  var iframe = document.createElement('iframe')
  iframe.id = 'qm-iframe'
  iframe.title = 'Questme Chat'
  iframe.allow = 'clipboard-write'
  iframe.src = BASE_URL + '/chat/' + botId
  iframeWrap.appendChild(iframe)

  var toggle = document.createElement('button')
  toggle.id = 'qm-toggle'
  toggle.setAttribute('aria-label', 'Open chat')
  toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#080A0E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'

  var isOpen = false
  var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#080A0E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  var chatIcon = toggle.innerHTML

  toggle.addEventListener('click', function () {
    isOpen = !isOpen
    if (isOpen) {
      iframeWrap.classList.add('open')
      toggle.innerHTML = closeIcon
      toggle.setAttribute('aria-label', 'Close chat')
    } else {
      iframeWrap.classList.remove('open')
      toggle.innerHTML = chatIcon
      toggle.setAttribute('aria-label', 'Open chat')
    }
  })

  bubble.appendChild(iframeWrap)
  bubble.appendChild(toggle)

  // Wait for body
  function mount() { document.body.appendChild(bubble) }
  if (document.body) { mount() } else { document.addEventListener('DOMContentLoaded', mount) }
})()
