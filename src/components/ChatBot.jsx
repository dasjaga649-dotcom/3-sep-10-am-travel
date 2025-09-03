import React, { useEffect, useMemo, useRef, useState } from 'react'

const ORANGE = 'rgb(255, 175, 43)'
const ORANGE_ALT = 'rgb(255, 157, 0)'
const BLUE = 'rgb(17, 146, 238)'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function ChatBot({
  botName = 'DIYA AI',
  botAvatar = 'https://www.yatra.com/b2cfrontend/diyaai2.png',
  initialOpen = false,
  initialMessages,
  onSend,
}) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isMax, setIsMax] = useState(false)
  const [messages, setMessages] = useState(() => {
    if (Array.isArray(initialMessages) && initialMessages.length) return initialMessages
    return [
      {
        id: uid(),
        sender: 'bot',
        type: 'text',
        text: "Hi! I'm DIYA, your travel assistant. I can help you book flights and hotels or manage your trips.",
        quickReplies: ['Book Flight', 'Find Hotels', 'Cancel Ticket'],
      },
    ]
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const containerRef = useRef(null)

  function scrollToBottom(smooth = false) {
    const el = containerRef.current
    if (!el) return
    const doScroll = () => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
      } catch {
        el.scrollTop = el.scrollHeight
      }
    }
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      requestAnimationFrame(() => {
        doScroll()
        setTimeout(doScroll, 0)
      })
    } else {
      doScroll()
      setTimeout(doScroll, 0)
    }
  }

  useMemo(() => ({ ORANGE, ORANGE_ALT, BLUE }), [])

  useEffect(() => {
    scrollToBottom(true)
  }, [messages, typing])

  useEffect(() => {
    if (isOpen) scrollToBottom(false)
  }, [isOpen])

  function resetChat() {
    setMessages([
      {
        id: uid(),
        sender: 'bot',
        type: 'text',
        text: "Hi! I'm DIYA, your travel assistant. I can help you book flights and hotels or manage your trips.",
        quickReplies: ['Book Flight', 'Find Hotels', 'Cancel Ticket'],
      },
    ])
  }

  function pushUserMessage(text) {
    const msg = { id: uid(), sender: 'user', type: 'text', text }
    setMessages((m) => [...m, msg])
  }

  function pushBotMessage(payload) {
    const msg = { id: uid(), sender: 'bot', ...payload }
    setMessages((m) => [...m, msg])
  }

  function simulateBotReply(text) {
    setTyping(true)
    const lower = text.toLowerCase()
    setTimeout(() => {
      if (lower.includes('flight') || lower.includes('book')) {
        pushBotMessage({ type: 'text', text: 'Great! Here are some flight options for you:' })
        pushBotMessage({
          type: 'results',
          results: [
            {
              id: uid(),
              type: 'flight',
              title: 'DEL → BOM · 28 Jan · 1 Stop',
              price: '₹ 5,499',
              image:
                'https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800&q=60&auto=format&fit=crop',
              ctaLabel: 'Book Now',
            },
            {
              id: uid(),
              type: 'flight',
              title: 'BLR → GOI · 02 Feb · Non-Stop',
              price: '₹ 3,999',
              image:
                'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=800&q=60&auto=format&fit=crop',
              ctaLabel: 'Book Now',
            },
          ],
        })
        pushBotMessage({
          type: 'text',
          text: 'Would you like me to refine results by date or price?',
          quickReplies: ['Earliest', 'Cheapest', 'Direct Flights'],
        })
      } else if (lower.includes('hotel') || lower.includes('stay')) {
        pushBotMessage({ type: 'text', text: 'Here are some hotels you might like:' })
        pushBotMessage({
          type: 'results',
          results: [
            {
              id: uid(),
              type: 'hotel',
              title: 'Seaside Resort · Goa',
              price: '₹ 2,499 / night',
              image:
                'https://images.unsplash.com/photo-1501117716987-c8e62f31b0d5?w=800&q=60&auto=format&fit=crop',
              ctaLabel: 'Book Now',
            },
            {
              id: uid(),
              type: 'hotel',
              title: 'City Lights Hotel · Mumbai',
              price: '₹ 3,299 / night',
              image:
                'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800&q=60&auto=format&fit=crop',
              ctaLabel: 'Book Now',
            },
          ],
        })
        pushBotMessage({ type: 'text', text: 'Need different dates or location?', quickReplies: ['Change Dates', 'New City', 'More Filters'] })
      } else if (lower.includes('cancel')) {
        pushBotMessage({ type: 'text', text: "I can help with cancellations. What's your booking ID?" })
      } else {
        pushBotMessage({
          type: 'text',
          text: "I'm here to help with travel. Try: Book Flight, Find Hotels, or Cancel Ticket.",
          quickReplies: ['Book Flight', 'Find Hotels', 'Cancel Ticket'],
        })
      }
      setTyping(false)
    }, 700)
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput('')
    pushUserMessage(text)
    if (onSend) onSend(text)
    simulateBotReply(text)
  }

  function handleChipClick(label) {
    pushUserMessage(label)
    simulateBotReply(label)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <style>{`
        .diyachat-root { --color-primary: ${BLUE}; --color-accent: ${ORANGE}; --color-accent-2: ${ORANGE_ALT}; --color-white: #ffffff; --color-light: #eef2f6; --color-secondary: ${ORANGE}; --color-text: #0f172a }

        .diyachat-floating { position: fixed; right: 1rem; bottom: 1rem; z-index: 1040 }
        .diyachat-open-btn { background: var(--color-primary); color: #fff; width: 56px; height: 56px; border-radius: 50%; border: none; box-shadow: 0 10px 20px rgba(0,0,0,.2); transition: transform .2s ease, box-shadow .2s ease }
        .diyachat-open-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0,0,0,.24) }

        .diyachat-window { width: 380px; max-height: 76vh; background: var(--color-light); border: 1px solid var(--color-light); border-radius: 12px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,.24); transform-origin: bottom right; opacity: 0; transform: translateY(12px) scale(.98); transition: opacity .2s ease, transform .2s ease; display: flex; flex-direction: column; min-height: 0 }
        .diyachat-window.open { opacity: 1; transform: translateY(0) scale(1) }
        .diyachat-window.max { width: min(640px, 96vw); max-height: 86vh }

        .diyachat-header { display: flex; justify-content: space-between; align-items: center; padding: .5rem .5rem; background: var(--color-white); color: var(--color-primary) }
        .diyachat-title { font-weight: 700; font-size: .95rem; line-height: 1.1; color: var(--color-primary) }
        .diyachat-actions { display: flex; gap: .25rem; align-items: center }
        .diyachat-iconbtn { padding: .35rem; border-radius: .5rem; background: transparent; border: none; color: var(--color-primary); transition: background .2s ease; cursor: pointer }
        .diyachat-iconbtn:hover { background: rgba(17,146,238,.08) }

        .diyachat-body { display: flex; flex-direction: column; height: 100%; flex: 1; min-height: 0 }
        .diyachat-scroll { flex: 1; overflow-y: auto; padding: .5rem; background: var(--color-light); min-height: 0; -webkit-overflow-scrolling: touch; overscroll-behavior: contain }
        .hide-scrollbar::-webkit-scrollbar { display: none }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none }

        .msg { display: flex; width: 100%; margin-bottom: .5rem }
        .msg.bot { justify-content: flex-start; align-items: flex-start }
        .msg.user { justify-content: flex-end; align-items: flex-start }
        .avatar { width: 32px; height: 32px; border-radius: 9999px; overflow: hidden; flex-shrink: 0; margin-right: .5rem }

        .bubble { display: inline-block; padding: .5rem .75rem; border-radius: 16px; position: relative; box-shadow: 0 .125rem .25rem rgba(0,0,0,.05); background: var(--color-white); border: 1px solid var(--color-light); max-width: 90%; word-break: break-word; white-space: pre-line }
        .bubble.user { background: var(--color-primary); color: #fff; border-color: var(--color-primary) }
        .bubble .chipbar { margin-top: .5rem; display: flex; gap: .5rem; flex-wrap: wrap }
        .chip { border: 1px solid var(--color-primary); color: var(--color-primary); background: var(--color-white); border-radius: 9999px; padding: .25rem .6rem; font-size: .8rem }
        .chip:hover { background: var(--color-primary); color: #fff }

        .typing { display: inline-flex; gap: 6px; align-items: center }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #999; opacity: .8; animation: bounce 1s infinite }
        .dot:nth-child(2) { animation-delay: .15s }
        .dot:nth-child(3) { animation-delay: .3s }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .5 } 40% { transform: translateY(-4px); opacity: 1 } }

        .result-card { border: 0; box-shadow: 0 2px 10px rgba(0,0,0,.06); overflow: hidden; border-radius: 12px }
        .result-title { color: #0f172a; font-weight: 600; font-size: .9rem }
        .result-price { color: var(--color-primary); font-weight: 700; font-size: .9rem }
        .cta { background: ${ORANGE_ALT}; border: 1px solid ${ORANGE_ALT}; color: #fff; border-radius: 10px; padding: .25rem .6rem; font-size: .8rem }
        .cta:hover { background: ${ORANGE}; border-color: ${ORANGE} }

        .footer { border-top: 1px solid var(--color-light); background: var(--color-light) }
        .footer-top { padding: .5rem .75rem; }
        .suggest { font-size: .75rem; color: #6b7280; text-align: left }
        .suggest button { color: var(--color-primary); font-weight: 600; background: transparent; border: none; padding: 0 }

        .composer { padding: .75rem .75rem }
        .rowx { display: flex; align-items: center; gap: .5rem }
        .icon-round { padding: .5rem; border-radius: 9999px; border: 1px solid var(--color-light); background: var(--color-white); color: var(--color-primary); cursor: pointer }
        .icon-round:hover { background: var(--color-light) }
        .input-wrap { position: relative; flex: 1; display: flex; align-items: center }
        .field { width: 100%; padding: .5rem .75rem; padding-right: 6rem; border: 1px solid var(--color-light); border-radius: 12px; outline: none; transition: box-shadow .2s ease, border-color .2s ease; color: #111827; background: var(--color-white) }
        .field::placeholder { color: #6b7280 }
        .field:focus { border-color: var(--color-primary); box-shadow: 0 0 0 .15rem rgba(17,146,238,.15) }
        .btn-mic, .btn-send { position: absolute; top: 50%; transform: translateY(-50%); padding: .4rem; border-radius: 9999px; border: 1px solid var(--color-light); background: var(--color-white); cursor: pointer }
        .btn-mic { right: 3rem; color: var(--color-primary) }
        .btn-send { right: .5rem }
        .btn-send:disabled { color: #9ca3af; cursor: not-allowed }

        @media (max-width: 576px) { .diyachat-window { width: calc(100vw - 1rem); max-height: 80vh } }
        .fade-in { animation: fadein .25s ease both }
        @keyframes fadein { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div className="diyachat-root diyachat-floating">
        {!isOpen && (
          <button aria-label="Open chat" className="diyachat-open-btn d-flex align-items-center justify-content-center" onClick={() => setIsOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c-1.66 0-3.226-.403-4.6-1.116L2 22l1.116-5.4A9.963 9.963 0 0 1 2 12Z" fill="currentColor" opacity=".15"/>
              <path d="M7 9h10M7 12h10M7 15h7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <div className={`diyachat-window ${isOpen ? 'open' : 'd-none'} ${isMax ? 'max' : ''}`}>
          <div className="diyachat-header">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar"><img src={botAvatar} alt="Chatbot Logo" className="w-100 h-100 object-fit-cover" /></div>
              <div className="flex-grow-1">
                <div className="diyachat-title text-truncate">{botName}</div>
              </div>
            </div>
            <div className="diyachat-actions">
              <button className="diyachat-iconbtn" title="Clear Chat" aria-label="Clear chat history" onClick={resetChat}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </button>
              <button className="diyachat-iconbtn" title="Maximize" aria-label="Maximize chat" onClick={() => setIsMax((v) => !v)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6"></path>
                  <path d="m21 3-7 7"></path>
                  <path d="m3 21 7-7"></path>
                  <path d="M9 21H3v-6"></path>
                </svg>
              </button>
              <button className="diyachat-iconbtn" title="Close Chat" aria-label="Close chat" onClick={() => setIsOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="diyachat-body">
            <div ref={containerRef} className="diyachat-scroll hide-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.sender === 'user' ? 'user' : 'bot'} fade-in`}>
                  {m.sender === 'bot' && (
                    <div className="avatar"><img src={botAvatar} alt="Chatbot Logo" className="w-100 h-100 object-fit-cover" /></div>
                  )}
                  {m.type === 'text' && (
                    <div className={`bubble ${m.sender === 'user' ? 'user' : ''}`}>
                      <div>{m.text}</div>
                      {Array.isArray(m.quickReplies) && m.quickReplies.length > 0 && (
                        <div className="chipbar">
                          {m.quickReplies.map((q) => (
                            <button key={q} className="chip" onClick={() => handleChipClick(q)}>{q}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {m.type === 'results' && (
                    <div className="bubble">
                      <div className="row g-2">
                        {m.results?.map((r) => (
                          <div key={r.id} className="col-12">
                            <div className="result-card">
                              <div className="row g-0">
                                <div className="col-4">
                                  <img src={r.image} alt={r.title} className="img-fluid h-100 object-fit-cover" onLoad={() => scrollToBottom(true)} />
                                </div>
                                <div className="col-8">
                                  <div className="p-2">
                                    <div className="result-title">{r.title}</div>
                                    <div className="result-price mt-1">{r.price}</div>
                                    <div className="mt-2"><button className="cta">{r.ctaLabel || 'Book Now'}</button></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="msg bot">
                  <div className="avatar"><img src={botAvatar} alt="Chatbot Logo" className="w-100 h-100 object-fit-cover" /></div>
                  <div className="bubble">
                    <span className="typing" aria-label="Bot is typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="footer">
              <div className="footer-top">
                <div className="suggest"><button>Quick suggestions</button></div>
              </div>
              <div className="composer">
                <div className="rowx">
                  <button className="icon-round" title="Click a monument picture for details." aria-label="Click a monument picture for details.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 18v-7"></path>
                      <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"></path>
                      <path d="M14 18v-7"></path>
                      <path d="M18 18v-7"></path>
                      <path d="M3 22h18"></path>
                      <path d="M6 18v-7"></path>
                    </svg>
                  </button>

                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Type your travel question here..."
                      className="field"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label="Message input"
                    />
                    <button className="btn-mic" title="Voice input" aria-label="Voice input">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" x2="12" y1="19" y2="22"></line>
                      </svg>
                    </button>
                    <button className="btn-send" title="Send message" aria-label="Send message" onClick={handleSend} disabled={!input.trim()}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                        <path d="m21.854 2.147-10.94 10.939"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
