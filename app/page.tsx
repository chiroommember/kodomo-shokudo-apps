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

export default function HomePage() {
  // 日本時間（JST）で今日の日付を取得するヘルパー関数
  const getJSTDate = () => {
    const now = new Date()
    return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  }

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [today, setToday] = useState<Date>(new Date())
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'volunteer' | 'staff' | 'admin'>('volunteer')

  useEffect(() => {
    // クライアント側で確実に日本時間（JST）の今日をセット
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
        updateRoleByEmail(session.user.email || '')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true)
        updateRoleByEmail(session.user.email || '')
      } else {
        setIsLoggedIn(false)
        setUserRole('volunteer')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserRole('volunteer')
    alert('ログアウトしました')
  }

  // カレンダーの計算ロジック
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // 月切り替えボタンの処理
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))
  }

  const handleCurrentMonth = () => {
    setCurrentDate(getJSTDate())
  }

  // 該当月の日数と1日の曜日を取得
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

        {/* 右上：管理者ボタンとログアウト */}
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
            <svg className="w-3.5 h-3.5 text-sky-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>ごはんを通じて繋がる、笑顔の輪。</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            長崎の子ども食堂とボランティアをつなぐ
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            活動予定の確認や参加申込が簡単に行えます。
          </p>
        </div>

        {/* メニュー 4列 */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">メニュー</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/about"
              className="p-5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-3xl shadow-sm transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5 group"
            >
              <svg className="w-6 h-6 text-white stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xs font-bold">初めての方へ</h3>
            </Link>

            <Link
              href="/shokudo"
              className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5"
            >
              <svg className="w-6 h-6 text-sky-500 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xs font-bold text-slate-700">子ども食堂一覧</h3>
            </Link>

            <Link
              href="/mypage"
              className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5"
            >
              <svg className="w-6 h-6 text-sky-500 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xs font-bold text-slate-700">マイページ・申込履歴</h3>
            </Link>

            <Link
              href="/checkin"
              className="p-5 bg-[#fffdf0] hover:border-amber-300 rounded-3xl border border-amber-200/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2.5"
            >
              <svg className="w-6 h-6 text-amber-500 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-xs font-bold text-slate-800">出席管理（当日用）</h3>
            </Link>
          </div>
        </div>

        {/* カレンダーエリア */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#008ce6] flex items-center gap-2">
              <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              活動・開催予定カレンダー
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1 pb-3">
            <h4 className="text-lg font-bold text-slate-800">
              {year}年 {month}月
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition"
              >
                前月
              </button>
              <button
                onClick={handleCurrentMonth}
                className="px-4 py-1 bg-[#00a6f4] text-white rounded-full text-xs font-bold shadow-2xs"
              >
                今月
              </button>
              <button
                onClick={handleNextMonth}
                className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition"
              >
                次月
              </button>
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
            {/* 月初めの曜日に合わせた空白セル */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[75px] rounded-2xl bg-slate-50/30 border border-slate-100/50" />
            ))}

            {/* 当月の日付セルを全日数分レンダリング */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() + 1 === month &&
                today.getDate() === dayNum

              return (
                <div
                  key={dayNum}
                  className={`min-h-[75px] p-2 rounded-2xl border transition flex flex-col justify-between ${
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
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
