import React, { useEffect, useMemo, useRef, useState } from 'react'

const ORANGE = 'rgb(255, 175, 43)'
const ORANGE_ALT = 'rgb(255, 157, 0)'
const BLUE = 'rgb(17, 146, 238)'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

// Message schema examples:
// { id, sender: 'bot'|'user', type: 'text', text }
// { id, sender: 'bot', type: 'results', results: [{ id, type: 'flight'|'hotel', title, price, image, ctaLabel }] }
// { id, sender: 'bot', type: 'text', text, quickReplies: ['Book Flight','Cancel Ticket'] }

export default function ChatBot({
  botName = 'DIYA Assistant',
  botAvatar = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=64&h=64&fit=crop&auto=format&q=60',
  initialOpen = false,
  initialMessages,
  onSend,
}) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [messages, setMessages] = useState(() => {
    if (Array.isArray(initialMessages) && initialMessages.length) return initialMessages
    return [
      {
        id: uid(),
        sender: 'bot',
        type: 'text',
        text: 'Hi! I\'m DIYA, your travel assistant. I can help you book flights and hotels or manage your trips.',
        quickReplies: ['Book Flight', 'Find Hotels', 'Cancel Ticket'],
      },
    ]
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const containerRef = useRef(null)

  const colors = useMemo(() => ({ ORANGE, ORANGE_ALT, BLUE }), [])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages, typing])

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
        pushBotMessage({
          type: 'text',
          text: 'Great! Here are some flight options for you:',
        })
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
        pushBotMessage({ type: 'text', text: 'I can help with cancellations. What\'s your booking ID?' })
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
        .diyachat-floating {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 1040;
        }
        .diyachat-btn {
          background: ${BLUE};
          background-image: linear-gradient(135deg, ${BLUE}, ${ORANGE});
          color: #fff;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          box-shadow: 0 10px 20px rgba(0,0,0,.2);
          transition: transform .2s ease, box-shadow .2s ease;
          border: none;
        }
        .diyachat-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0,0,0,.24) }
        .diyachat-window {
          width: 360px;
          max-height: 70vh;
          border: 0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,.24);
          transform-origin: bottom right;
          opacity: 0; transform: translateY(12px) scale(.98);
          transition: opacity .2s ease, transform .2s ease;
          backdrop-filter: saturate(180%) blur(6px);
        }
        .diyachat-window.open { opacity: 1; transform: translateY(0) scale(1) }
        .diyachat-header {
          background: linear-gradient(90deg, ${ORANGE}, ${BLUE});
          color: #fff;
        }
        .diyachat-badge { background: rgba(255,255,255,.2); }
        .diyachat-body { background: #f7f8fa; }
        .diyachat-messages { height: 48vh; overflow: auto; }
        .diyachat-input { border-top: 1px solid rgba(0,0,0,.06) }
        .diyachat-bubble { max-width: 80%; border-radius: 14px; padding: .6rem .8rem }
        .diyachat-bubble-user { background: ${BLUE}; color: #fff; border-top-right-radius: 4px }
        .diyachat-bubble-bot { background: #fff; color: #111; box-shadow: 0 2px 10px rgba(0,0,0,.06); border-top-left-radius: 4px }
        .diyachat-typing {
          display: inline-flex; gap: 6px; align-items: center
        }
        .diyachat-dot { width: 6px; height: 6px; border-radius: 50%; background: #999; opacity: .8; animation: diyachat-bounce 1s infinite }
        .diyachat-dot:nth-child(2) { animation-delay: .15s }
        .diyachat-dot:nth-child(3) { animation-delay: .3s }
        @keyframes diyachat-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .5 }
          40% { transform: translateY(-4px); opacity: 1 }
        }
        .diyachat-chip { border: 1px solid ${BLUE}; color: ${BLUE}; background: #fff; }
        .diyachat-chip:hover { background: ${BLUE}; color: #fff }
        .diyachat-cta { background: ${ORANGE_ALT}; border-color: ${ORANGE_ALT} }
        .diyachat-cta:hover { background: ${ORANGE}; border-color: ${ORANGE} }
        .diyachat-title { color: #0f172a }
        .diyachat-price { color: ${BLUE}; font-weight: 700 }
        @media (max-width: 576px) {
          .diyachat-window { width: calc(100vw - 1rem); max-height: 80vh }
        }
        .message-enter { animation: diyachat-fade-in .25s ease both }
        @keyframes diyachat-fade-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div className="diyachat-floating">
        {!isOpen && (
          <button
            aria-label="Open chat"
            className="diyachat-btn d-flex align-items-center justify-content-center"
            onClick={() => setIsOpen(true)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c-1.66 0-3.226-.403-4.6-1.116L2 22l1.116-5.4A9.963 9.963 0 0 1 2 12Z" opacity=".25"/>
              <path d="M7 9h10M7 12h10M7 15h7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <div className={`card diyachat-window ${isOpen ? 'open' : 'd-none'}`}>
          <div className="diyachat-header p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <img src={botAvatar} alt="Bot" className="rounded-circle" width={36} height={36} />
              <div>
                <div className="fw-semibold">{botName}</div>
                <div className="badge rounded-pill diyachat-badge">Online</div>
              </div>
            </div>
            <button className="btn btn-sm btn-light" onClick={() => setIsOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="diyachat-body">
            <div ref={containerRef} className="diyachat-messages p-3">
              {messages.map((m) => (
                <div key={m.id} className="mb-3 message-enter">
                  {m.sender === 'user' ? (
                    <div className="d-flex justify-content-end">
                      <div className="diyachat-bubble diyachat-bubble-user">{m.text}</div>
                    </div>
                  ) : m.type === 'text' ? (
                    <div className="d-flex">
                      <div className="diyachat-bubble diyachat-bubble-bot">
                        <div>{m.text}</div>
                        {Array.isArray(m.quickReplies) && m.quickReplies.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            {m.quickReplies.map((q) => (
                              <button key={q} className="btn btn-sm diyachat-chip rounded-pill" onClick={() => handleChipClick(q)}>
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : m.type === 'results' ? (
                    <div className="d-flex">
                      <div className="diyachat-bubble diyachat-bubble-bot w-100">
                        <div className="row g-2">
                          {m.results?.map((r) => (
                            <div key={r.id} className="col-12">
                              <div className="card border-0 shadow-sm overflow-hidden">
                                <div className="row g-0">
                                  <div className="col-4">
                                    <img src={r.image} alt={r.title} className="img-fluid h-100 object-fit-cover" />
                                  </div>
                                  <div className="col-8">
                                    <div className="card-body py-2">
                                      <div className="small diyachat-title fw-semibold">{r.title}</div>
                                      <div className="small diyachat-price mt-1">{r.price}</div>
                                      <div className="mt-2">
                                        <button className="btn btn-sm btn-primary diyachat-cta">{r.ctaLabel || 'Book Now'}</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              {typing && (
                <div className="d-flex mb-2">
                  <div className="diyachat-bubble diyachat-bubble-bot">
                    <span className="diyachat-typing" aria-label="Bot is typing">
                      <span className="diyachat-dot" />
                      <span className="diyachat-dot" />
                      <span className="diyachat-dot" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="diyachat-input p-2">
              <div className="input-group">
                <textarea
                  className="form-control"
                  rows={1}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Message input"
                />
                <button className="btn btn-primary" onClick={handleSend} aria-label="Send message">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
