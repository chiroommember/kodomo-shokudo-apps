'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ADMIN_EMAILS = [
  'bb15125017@ms.nagasaki-u.ac.jp',
]
const STAFF_EMAILS: string[] = []

type EventItem = {
  id: string
  title: string
  event_date: string
  time: string
  location: string
  description?: string
  capacity: number
}

type RegistrationItem = {
  id: string
  event_id: string
  user_email: string
  message?: string
  participation_time?: string
}

export default function HomePage() {
  const getJSTDate = () => {
    const now = new Date()
    return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  }

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [today, setToday] = useState<Date>(new Date())
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'volunteer' | 'staff' | 'admin'>('volunteer')
  
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('14:00')
  const [partMessage, setPartMessage] = useState('')

  const hoursList = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00'
  ]

  const fetchData = async () => {
    const { data: eventData } = await supabase.from('events').select('*')
    if (eventData) setEvents(eventData)

    const { data: regData } = await supabase.from('registrations').select('*')
    if (regData) setRegistrations(regData)
  }

  useEffect(() => {
    const jstToday = getJSTDate()
    setCurrentDate(jstToday)
    setToday(jstToday)

    const updateRoleByEmail = async (email: string) => {
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single()

      if (prof && prof.role) {
        setUserRole(prof.role as 'volunteer' | 'staff' | 'admin')
      } else if (ADMIN_EMAILS.includes(email)) {
        setUserRole('admin')
      } else if (STAFF_EMAILS.includes(email)) {
        setUserRole('staff')
      } else {
        setUserRole('volunteer')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        setIsLoggedIn(true)
        setUserEmail(session.user.email)
        updateRoleByEmail(session.user.email)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user.email) {
        setIsLoggedIn(true)
        setUserEmail(session.user.email)
        updateRoleByEmail(session.user.email)
      } else {
        setIsLoggedIn(false)
        setUserEmail(null)
        setUserRole('volunteer')
      }
    })

    fetchData()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserEmail(null)
    setUserRole('volunteer')
    alert('ログアウトしました')
  }

  const handleOpenModal = (ev: EventItem) => {
    if (!isLoggedIn) {
      alert('参加するにはログインが必要です。')
      return
    }
    setSelectedEvent(ev)
    const times = ev.time ? ev.time.split(' 〜 ') : ['10:00', '14:00']
    setStartTime(times[0] || '10:00')
    setEndTime(times[1] || '14:00')
    setPartMessage('')
  }

  const submitApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !userEmail) return

    const formattedParticipationTime = `${startTime} 〜 ${endTime}`

    const { error } = await supabase.from('registrations').insert([
      {
        event_id: selectedEvent.id,
        user_email: userEmail,
        message: partMessage,
        participation_time: formattedParticipationTime,
      },
    ])

    if (error) {
      if (error.code === '23505') {
        alert('すでにこのイベントには申し込んでいます。')
      } else {
        alert('申込に失敗しました: ' + error.message)
      }
    } else {
      alert(`「${selectedEvent.title}」に参加申し込みしました！`)
      setSelectedEvent(null)
      setPartMessage('')
      fetchData()
    }
  }

  const handleCancelApply = async (eventId: string, eventTitle: string) => {
    if (!userEmail) return
    if (!confirm(`「${eventTitle}」の参加をキャンセルしますか？`)) return

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_email', userEmail)

    if (error) {
      alert('キャンセルに失敗しました: ' + error.message)
    } else {
      alert('参加申し込みをキャンセルしました')
      fetchData()
    }
  }

  const handleDeleteEvent = async (eventId: string, eventTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`「${eventTitle}」を削除してもよろしいですか？`)) return

    const { error } = await supabase.from('events').delete().eq('id', eventId)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      alert('イベントを削除しました')
      fetchData()
    }
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()

  const daysWithEvents = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    const dayEvents = events.filter((ev) => ev.event_date === dateString)
    return { dayNum, dateString, dayEvents }
  }).filter((item) => item.dayEvents.length > 0)

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-lg leading-tight">ちるーむ</h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <Link href="/admin/users" className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-[#5582ff] hover:bg-blue-600 rounded-full transition shadow-sm">
                  管理者
                </Link>
              )}
              <span className="text-xs text-slate-500 font-bold hidden md:inline">{userEmail}</span>
              <button onClick={handleLogout} className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition cursor-pointer">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-[#0095f6] hover:bg-sky-500 rounded-full transition shadow-sm">ログイン</Link>
              <Link href="/register" className="px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#0095f6] bg-sky-50 hover:bg-sky-100 rounded-full transition">新規登録</Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 space-y-6">
        <div className="bg-[#f0f7ff] border border-sky-100/70 rounded-3xl p-5 sm:p-7 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#0095f6] bg-white px-3.5 py-1 rounded-full border border-sky-100 shadow-2xs">
            <span>ごはんを通じて繋がる、笑顔の輪。</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">長崎の子ども食堂とボランティアをつなぐ</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">活動予定の確認や参加申込が簡単に行えます。</p>
        </div>

        <div className="space-y-2.5">
          <p className="text-xs font-bold text-slate-400">メニュー</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <Link href="/about" className="p-4 sm:p-5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-3xl shadow-sm transition flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] space-y-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-[11px] sm:text-xs font-bold">初めての方へ</h3>
            </Link>
            <Link href="/shokudo" className="p-4 sm:p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] space-y-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-700">子ども食堂一覧</h3>
            </Link>
            <Link href="/mypage" className="p-4 sm:p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] space-y-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-700">マイページ・申込履歴</h3>
            </Link>

            {(userRole === 'admin' || userRole === 'staff') && (
              <Link href="/checkin" className="p-4 sm:p-5 bg-[#fffdf0] hover:border-amber-300 rounded-3xl border border-amber-200/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] space-y-2 col-span-2 sm:col-span-1">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-800">出席管理（当日用）</h3>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-sky-100/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pt-1 pb-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-800">{year}年 {month}月</h4>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition cursor-pointer">前月</button>
              <button onClick={() => setCurrentDate(getJSTDate())} className="px-3.5 py-1 bg-[#00a6f4] text-white rounded-full text-xs font-bold shadow-2xs cursor-pointer">今月</button>
              <button onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition cursor-pointer">次月</button>
            </div>
          </div>

          <div className="block sm:hidden space-y-3">
            {(userRole === 'staff' || userRole === 'admin') && (
              <div className="flex justify-end pb-1">
                <Link href="/events/new" className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0095f6] rounded-xl text-xs font-bold transition flex items-center gap-1">
                  <span>+ イベントを追加する</span>
                </Link>
              </div>
            )}

            {daysWithEvents.length === 0 ? (
              <div className="p-6 bg-slate-50/50 rounded-2xl text-center text-xs text-slate-400 font-medium">
                今月の活動予定はありません。
              </div>
            ) : (
              daysWithEvents.map(({ dayNum, dateString, dayEvents }) => {
                const dateObj = new Date(dateString)
                const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()]
                const isSunday = dateObj.getDay() === 0
                const isSaturday = dateObj.getDay() === 6

                return (
                  <div key={dateString} className="p-4 bg-sky-50/40 border border-sky-100/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-sky-100/60 pb-2">
                      <span className={`text-xs font-black ${isSunday ? 'text-rose-500' : isSaturday ? 'text-sky-500' : 'text-slate-700'}`}>
                        {month}月{dayNum}日（{dayOfWeek}）
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{dayEvents.length}件の予定</span>
                    </div>

                    <div className="space-y-2.5">
                      {dayEvents.map((ev) => {
                        const eventRegs = registrations.filter((r) => r.event_id === ev.id)
                        const count = eventRegs.length
                        const isAlreadyApplied = userEmail ? eventRegs.some((r) => r.user_email === userEmail) : false
                        const isFull = count >= ev.capacity

                        return (
                          <div key={ev.id} className="bg-white border border-sky-100 p-3.5 rounded-xl space-y-2 shadow-2xs">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-xs font-bold text-[#0095f6]">{ev.title}</h5>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">時間: {ev.time}</p>
                              </div>
                              {(userRole === 'staff' || userRole === 'admin') && (
                                <button onClick={(e) => handleDeleteEvent(ev.id, ev.title, e)} className="text-slate-300 hover:text-rose-500 transition p-1 cursor-pointer">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className={isFull ? 'text-rose-500 font-bold' : 'text-slate-500 font-bold'}>
                                申込状況: {count} / {ev.capacity}人
                              </span>

                              {isAlreadyApplied ? (
                                <button onClick={() => handleCancelApply(ev.id, ev.title)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer">
                                  申込済み (取消)
                                </button>
                              ) : isFull ? (
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold">満員</span>
                              ) : (
                                <button onClick={() => handleOpenModal(ev)} className="px-4 py-1.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer">
                                  参加する
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="hidden sm:block space-y-4">
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold mb-1">
              <div className="text-rose-500">日</div>
              <div className="text-slate-600">月</div>
              <div className="text-slate-600">火</div>
              <div className="text-slate-600">水</div>
              <div className="text-slate-600">木</div>
              <div className="text-slate-600">金</div>
              <div className="text-sky-500">土</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[140px] rounded-2xl bg-slate-50/20 border border-slate-100/40" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1
                const dateString = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                const dayEvents = events.filter((ev) => ev.event_date === dateString)
                const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === dayNum

                return (
                  <div key={dayNum} className={`min-h-[145px] p-2 rounded-2xl border transition flex flex-col justify-between bg-white ${isToday ? 'border-[#0095f6] border-2 shadow-xs' : 'border-sky-100'}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 bg-[#0095f6] text-white rounded-full flex items-center justify-center text-[10px]' : 'text-slate-500'}`}>{dayNum}</span>
                      {(userRole === 'staff' || userRole === 'admin') && (
                        <Link href="/events/new" className="px-1.5 py-0.5 bg-sky-50 hover:bg-sky-100 text-[#0095f6] rounded-md text-[10px] font-bold transition">+追加</Link>
                      )}
                    </div>

                    <div className="space-y-1 mt-1 overflow-y-auto max-h-[105px]">
                      {dayEvents.map((ev) => {
                        const eventRegs = registrations.filter((r) => r.event_id === ev.id)
                        const count = eventRegs.length
                        const isAlreadyApplied = userEmail ? eventRegs.some((r) => r.user_email === userEmail) : false
                        const isFull = count >= ev.capacity

                        return (
                          <div key={ev.id} className="bg-sky-50/70 border border-sky-100 p-2 rounded-xl space-y-1 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#0095f6] truncate" title={ev.title}>{ev.title}</span>
                              {(userRole === 'staff' || userRole === 'admin') && (
                                <button onClick={(e) => handleDeleteEvent(ev.id, ev.title, e)} className="text-slate-400 hover:text-rose-500 transition p-0.5 cursor-pointer" title="削除">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                              <span className="truncate">{ev.time}</span>
                              <span className={isFull ? 'text-rose-500 font-bold' : 'text-slate-600'}>申込 {count}/{ev.capacity}</span>
                            </div>
                            <div>
                              {isAlreadyApplied ? (
                                <button onClick={() => handleCancelApply(ev.id, ev.title)} className="w-full py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition text-center shadow-2xs cursor-pointer">
                                  申込済み (取消)
                                </button>
                              ) : isFull ? (
                                <div className="w-full py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold text-center">満員</div>
                              ) : (
                                <button onClick={() => handleOpenModal(ev)} className="w-full py-1 bg-[#0095f6] hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold transition text-center shadow-2xs cursor-pointer">
                                  参加する
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">イベント参加お申し込み</h3>
              <p className="text-xs font-bold text-[#0095f6]">{selectedEvent.title}</p>
              <p className="text-[11px] text-slate-400 font-medium">イベント開催時間: {selectedEvent.time}</p>
            </div>

            <form onSubmit={submitApply} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">参加希望時間（7:00〜23:00の間で選択）</label>
                <div className="flex items-center gap-2">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
                  >
                    {hoursList.map((time) => (
                      <option key={`p-start-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                  <span className="text-xs font-bold text-slate-400">〜</span>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
                  >
                    {hoursList.map((time) => (
                      <option key={`p-end-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">ひとことメッセージ・質問など</label>
                <textarea
                  rows={3}
                  placeholder="例：少し遅れて到着するかもしれません。よろしくお願いいたします！"
                  value={partMessage}
                  onChange={(e) => setPartMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  やめる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  申し込む
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
