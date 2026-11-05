'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 管理者のメールアドレスリスト
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

  const fetchData = async () => {
    // イベント取得
    const { data: eventData } = await supabase.from('events').select('*')
    if (eventData) setEvents(eventData)

    // 申込状況取得
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

  // イベント参加申し込み
  const handleApply = async (eventId: string, eventTitle: string, capacity: number) => {
    if (!isLoggedIn || !userEmail) {
      alert('イベントに参加するにはログインが必要です。')
      return
    }

    // 現在の申込数チェック
    const currentCount = registrations.filter((r) => r.event_id === eventId).length
    if (currentCount >= capacity) {
      alert('定員に達しているため、申し込めません。')
      return
    }

    const { error } = await supabase.from('registrations').insert([
      {
        event_id: eventId,
        user_email: userEmail,
      },
    ])

    if (error) {
      if (error.code === '23505') {
        alert('すでにこのイベントには申し込んでいます。')
      } else {
        alert('申込に失敗しました: ' + error.message)
      }
    } else {
      alert(`「${eventTitle}」に参加申し込みしました！`)
      fetchData()
    }
  }

  // 申込キャンセル
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

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))
  const handleCurrentMonth = () => setCurrentDate(getJSTDate())

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
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
                <Link
                  href="/admin/users"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#5582ff] hover:bg-blue-600 rounded-full transition shadow-sm"
                >
                  管理者
                </Link>
              )}
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0095f6] hover:bg-sky-500 rounded-full transition shadow-sm"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-xs font-bold text-[#0095f6] bg-sky-50 hover:bg-sky-100 rounded-full transition"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-6 pt-6 space-y-7">
        {/* ヒーローバナー */}
        <div className="bg-[#f0f7ff] border border-sky-100/70 rounded-3xl p-7 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0095f6] bg-white px-3.5 py-1 rounded-full border border-sky-100 shadow-2xs">
            <span>ごはんを通じて繋がる、笑顔の輪。</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            長崎の子ども食堂とボランティアをつなぐ
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            活動予定の確認や参加申込が簡単に行えます。
          </p>
        </div>

        {/* メニュー */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">メニュー</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/about" className="p-5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-3xl shadow-sm transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5">
              <h3 className="text-xs font-bold">初めての方へ</h3>
            </Link>
            <Link href="/shokudo" className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5">
              <h3 className="text-xs font-bold text-slate-700">子ども食堂一覧</h3>
            </Link>
            <Link href="/mypage" className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5">
              <h3 className="text-xs font-bold text-slate-700">マイページ・申込履歴</h3>
            </Link>
            <Link href="/checkin" className="p-5 bg-[#fffdf0] hover:border-amber-300 rounded-3xl border border-amber-200/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800">出席管理（当日用）</h3>
            </Link>
          </div>
        </div>

        {/* カレンダーエリア */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#008ce6] flex items-center gap-2">
              活動・開催予定カレンダー
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1 pb-3">
            <h4 className="text-lg font-bold text-slate-800">
              {year}年 {month}月
            </h4>
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevMonth} className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition">前月</button>
              <button onClick={handleCurrentMonth} className="px-4 py-1 bg-[#00a6f4] text-white rounded-full text-xs font-bold shadow-2xs">今月</button>
              <button onClick={handleNextMonth} className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition">次月</button>
            </div>
          </div>

          {/* 曜日 */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold mb-1">
            <div className="text-rose-500">日</div>
            <div className="text-slate-600">月</div>
            <div className="text-slate-600">火</div>
            <div className="text-slate-600">水</div>
            <div className="text-slate-600">木</div>
            <div className="text-slate-600">金</div>
            <div className="text-sky-500">土</div>
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[110px] rounded-2xl bg-slate-50/30 border border-slate-100/50" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1
              const monthStr = String(month).padStart(2, '0')
              const dayStr = String(dayNum).padStart(2, '0')
              const dateString = `${year}-${monthStr}-${dayStr}`

              const dayEvents = events.filter((ev) => ev.event_date === dateString)

              const isToday =
                today.getFullYear() === year &&
                today.getMonth() + 1 === month &&
                today.getDate() === dayNum

              return (
                <div
                  key={dayNum}
                  className={`min-h-[120px] p-2 rounded-2xl border transition flex flex-col justify-between ${
                    isToday
                      ? 'border-[#0095f6] border-2 bg-white'
                      : 'border-sky-100 bg-white hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 bg-[#0095f6] text-white rounded-full flex items-center justify-center text-[11px]'
                          : 'text-slate-500'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {(userRole === 'staff' || userRole === 'admin') && (
                      <Link
                        href="/events/new"
                        className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-[#0095f6] rounded-md text-[10px] font-bold transition"
                      >
                        +追加
                      </Link>
                    )}
                  </div>

                  {/* 登録されたイベントの表示 */}
                  <div className="space-y-1.5 mt-1 overflow-y-auto max-h-[85px]">
                    {dayEvents.map((ev) => {
                      const eventRegs = registrations.filter((r) => r.event_id === ev.id)
                      const count = eventRegs.length
                      const isAlreadyApplied = userEmail ? eventRegs.some((r) => r.user_email === userEmail) : false
                      const isFull = count >= ev.capacity

                      return (
                        <div
                          key={ev.id}
                          className="bg-sky-50 border border-sky-100 p-1.5 rounded-xl space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#0095f6] truncate" title={ev.title}>
                              {ev.title}
                            </span>
                            {(userRole === 'staff' || userRole === 'admin') && (
                              <button
                                onClick={(e) => handleDeleteEvent(ev.id, ev.title, e)}
                                className="text-slate-400 hover:text-rose-500 transition p-0.5"
                                title="削除"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[9px] text-slate-500">
                            <span>{ev.time}</span>
                            <span className={isFull ? 'text-rose-500 font-bold' : 'text-slate-600'}>
                              申込: {count}/{ev.capacity}人
                            </span>
                          </div>

                          {/* 参加申込・キャンセルボタン */}
                          <div>
                            {isAlreadyApplied ? (
                              <button
                                onClick={() => handleCancelApply(ev.id, ev.title)}
                                className="w-full py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-[9px] font-bold transition text-center"
                              >
                                申込済み (取消)
                              </button>
                            ) : isFull ? (
                              <div className="w-full py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-bold text-center">
                                受付終了（満員）
                              </div>
                            ) : (
                              <button
                                onClick={() => handleApply(ev.id, ev.title, ev.capacity)}
                                className="w-full py-0.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded text-[9px] font-bold transition text-center shadow-2xs"
                              >
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
    </div>
  )
}
