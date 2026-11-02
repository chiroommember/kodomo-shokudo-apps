'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 💡 管理者のメールアドレスリスト
const ADMIN_EMAILS = [
  'bb15125017@ms.nagasaki-u.ac.jp',
]

const STAFF_EMAILS: string[] = []

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1))
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'volunteer' | 'staff' | 'admin'>('volunteer')

  useEffect(() => {
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

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

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
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition"
              >
                <span>ログアウト</span>
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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0095f6] bg-white px-3.5 py-1 rounded-full border border-sky-100 shadow-2xs">
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
            {/* 1. 初めての方へ（青のメインカード） */}
            <Link
              href="/about"
              className="p-5 bg-[#0070f3] hover:bg-blue-600 text-white rounded-3xl shadow-sm transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2 group"
            >
              <h3 className="text-xs font-bold">初めての方へ</h3>
            </Link>

            {/* 2. 子ども食堂一覧 */}
            <Link
              href="/shokudo"
              className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2"
            >
              <h3 className="text-xs font-bold text-slate-700">子ども食堂一覧</h3>
            </Link>

            {/* 3. マイページ・申込履歴 */}
            <Link
              href="/mypage"
              className="p-5 bg-white hover:border-sky-300 rounded-3xl border border-sky-100/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2"
            >
              <h3 className="text-xs font-bold text-slate-700">マイページ・申込履歴</h3>
            </Link>

            {/* 4. 出席管理（当日用） */}
            <Link
              href="/checkin"
              className="p-5 bg-[#fffdf0] hover:border-amber-300 rounded-3xl border border-amber-200/80 shadow-2xs transition flex flex-col items-center justify-center text-center min-h-[120px] space-y-2"
            >
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
              <button className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition">
                前月
              </button>
              <button className="px-4 py-1 bg-[#00a6f4] text-white rounded-full text-xs font-bold shadow-2xs">
                今月
              </button>
              <button className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition">
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
            {/* 前月の空セル（木曜日始まり） */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[75px] rounded-2xl bg-slate-50/30 border border-slate-100/50" />
            ))}

            {/* 日付セル */}
            {Array.from({ length: 24 }, (_, i) => {
              const dayNum = i + 1
              const isSelectedDay = dayNum === 22

              return (
                <div
                  key={dayNum}
                  className={`min-h-[75px] p-2 rounded-2xl border transition flex flex-col justify-between ${
                    isSelectedDay
                      ? 'border-[#0095f6] border-2 bg-white'
                      : 'border-sky-100 bg-white hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        isSelectedDay
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
