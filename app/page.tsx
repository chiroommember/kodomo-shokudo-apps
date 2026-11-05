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

  // 申込モーダル用のステート
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [partTime, setPartTime] = useState('10:00 〜 14:00')
  const [partMessage, setPartMessage] = useState('')

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

    const updateRoleByEmail = (email: string) => {
      if (ADMIN_EMAILS.includes(email)) {
        setUserRole('admin')
      } else if (STAFF_EMAILS.includes(email)) {
        setUserRole('staff')
      } else {
        setUserRole('volunteer')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true)
        setUserEmail(session.user.email || null)
        updateRoleByEmail(session.user.email || '')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true)
        setUserEmail(session.user.email || null)
        updateRoleByEmail(session.user.email || '')
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

  // 参加申込実行
  const submitApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !userEmail) return

    const { error } = await supabase.from('registrations').insert([
      {
        event_id: selectedEvent.id,
        user_email: userEmail,
        message: partMessage,
        participation_time: partTime,
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

  // キャンセル
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

  // イベント削除
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

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">ちるーむ</h1>
            <p className="text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <Link href="/admin/users" className="px-4 py-2 text-xs font-bold text-white bg-[#5582ff] hover:bg-blue-600 rounded-full transition shadow-sm">
                  管理者
                </Link>
              )}
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">{userEmail}</span>
              <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2 text-xs font-bold text-white bg-[#0095f6] hover:bg-sky-500 rounded-full transition shadow-sm">ログイン</Link>
              <Link href="/register" className="px-5 py-2 text-xs font-bold text-[#0095f6] bg-sky-50 hover:bg-sky-100 rounded-full transition">新規登録</Link>
            </>
          )}
        </div>
      </header>

      {/* メイン */}
      <main className="max-w-4xl mx-auto px-6 pt-6 space-y-7">
        <div className="bg-[#f0f7ff] border border-sky-100/70 rounded-3xl p-7 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0095f6] bg-white px-3.5 py-1 rounded-full border border-sky-100 shadow-2xs">
            <span>ごはんを通じて繋がる、笑顔の輪。</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">長崎の子ども食堂とボランティアをつなぐ</h2>
          <p className="text-xs text-slate-400 font-medium">活動予定の確認や参加申込が簡単に行えます。</p>
        </div>

        {/* メニュー */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">メニュー</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/about" className="p-5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-3xl shadow-sm transition flex flex-col items-center justify-center text-center min-h-[110px] space-y-2">
              <h3 className="text-xs font-bold">初めての方へ</h3>
            </Link>
            <Link href="/shokudo" className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[110px] space-y-2">
              <h3 className="text-xs font-bold text-slate-700">子ども食堂一覧</h3>
            </Link>
            <Link href="/mypage" className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[110px] space-y-2">
              <h3 className="text-xs font-bold text-slate-700">マイページ・申込履歴</h3>
            </Link>
            <Link href="/checkin" className="p-5 bg-[#fffdf0] hover:border-amber-300 rounded-3xl border border-amber-200/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[110px] space-y-2">
              <h3 className="text-xs font-bold text-slate-800">出席管理（当日用）</h3>
            </Link>
          </div>
        </div>

        {/* カレンダー */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pt-1 pb-3">
            <h4 className="text-lg font-bold text-slate-800">{year}年 {month}月</h4>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))} className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition">前月</button>
              <button onClick={() => setCurrentDate(getJSTDate())} className="px-4 py-1 bg-[#00a6f4] text-white rounded-full text-xs font-bold shadow-2xs">今月</button>
              <button onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))} className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition">次月</button>
            </div>
          </div>

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
              <div key={`empty-${i}`} className="min-h-[130px] rounded-2xl bg-slate-50/20 border border-slate-100/40" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1
              const dateString = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
              const dayEvents = events.filter((ev) => ev.event_date === dateString)
              const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === dayNum

              return (
                <div key={dayNum} className={`min-h-[135px] p-2 rounded-2xl border transition flex flex-col justify-between bg-white ${isToday ? 'border-[#0095f6] border-2 shadow-xs' : 'border-sky-100'}`}>
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 bg-[#0095f6] text-white rounded-full flex items-center justify-center text-[11px]' : 'text-slate-500'}`}>{dayNum}</span>
                    {(userRole === 'staff' || userRole === 'admin') && (
                      <Link href="/events/new" className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-[#0095f6] rounded-md text-[10px] font-bold transition">+追加</Link>
                    )}
                  </div>

                  <div className="space-y-1.5 mt-1 overflow-y-auto max-h-[95px]">
                    {dayEvents.map((ev) => {
                      const eventRegs = registrations.filter((r) => r.event_id === ev.id)
                      const count = eventRegs.length
                      const isAlreadyApplied = userEmail ? eventRegs.some((r) => r.user_email === userEmail) : false
                      const isFull = count >= ev.capacity

                      return (
                        <div key={ev.id} className="bg-sky-50/80 border border-sky-100 p-2 rounded-xl space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#0095f6] truncate" title={ev.title}>{ev.title}</span>
                            {(userRole === 'staff' || userRole === 'admin') && (
                              <button onClick={(e) => handleDeleteEvent(ev.id, ev.title, e)} className="text-slate-400 hover:text-rose-500 transition p-0.5" title="削除">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                            <span>{ev.time}</span>
                            <span className={isFull ? 'text-rose-500 font-bold' : 'text-slate-600'}>申込 {count}/{ev.capacity}</span>
                          </div>
                          <div>
                            {isAlreadyApplied ? (
                              <button onClick={() => handleCancelApply(ev.id, ev.title)} className="w-full py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition text-center">
                                申込済み (取消)
                              </button>
                            ) : isFull ? (
                              <div className="w-full py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold text-center">満員</div>
                            ) : (
                              <button onClick={() => {
                                if (!isLoggedIn) { alert('参加するにはログインが必要です。'); return; }
                                setSelectedEvent(ev);
                              }} className="w-full py-1 bg-[#0095f6] hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold transition text-center shadow-2xs">
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
      </main>

      {/* 参加詳細モーダル */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">イベント参加お申し込み</h3>
              <p className="text-xs font-bold text-[#0095f6]">{selectedEvent.title}</p>
            </div>

            <form onSubmit={submitApply} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">参加希望時間</label>
                <select
                  value={partTime}
                  onChange={(e) => setPartTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                >
                  <option value="10:00 〜 14:00">10:00 〜 14:00 (全日程)</option>
                  <option value="10:00 〜 12:00">10:00 〜 12:00 (午前のみ)</option>
                  <option value="12:00 〜 14:00">12:00 〜 14:00 (午後のみ)</option>
                  <option value="ご相談（その他）">ご相談（その他）</option>
                </select>
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
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
                >
                  やめる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition"
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
