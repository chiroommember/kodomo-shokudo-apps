'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1))
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'volunteer' | 'staff' | 'admin'>('volunteer')

  // 簡易的なログイン状態のチェック（デモ用）
  useEffect(() => {
    const loggedInFlag = localStorage.getItem('isLoggedIn')
    const savedRole = localStorage.getItem('userRole')
    if (loggedInFlag === 'true') {
      setIsLoggedIn(true)
      if (savedRole) setUserRole(savedRole as 'volunteer' | 'staff' | 'admin')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    alert('ログアウトしました')
  }

  // カレンダー用イベントデータ
  const events = [
    { day: 10, title: '長崎大学前 こども食堂', time: '17:00〜' },
    { day: 18, title: '浦上 交流こども食堂', time: '11:30〜' },
    { day: 25, title: '中央 こども食堂サポート', time: '16:30〜' },
  ]

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#00a6f4] text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">ちるーむ</h1>
            <p className="text-[11px] text-slate-400">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>

        {/* 右上：ログイン状態に応じた表示 */}
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              {/* スタッフ・管理者の場合のみイベント追加や管理画面ボタンを表示 */}
              {(userRole === 'staff' || userRole === 'admin') && (
                <Link
                  href="/events/new"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#00a6f4] hover:bg-sky-600 rounded-xl shadow-sm transition"
                >
                  + イベント作成
                </Link>
              )}
              {userRole === 'admin' && (
                <Link
                  href="/admin/users"
                  className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition"
                >
                  権限管理
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-xs font-bold text-white bg-[#00a6f4] hover:bg-sky-500 rounded-xl transition shadow-sm"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-xs font-bold text-[#00a6f4] bg-sky-50 hover:bg-sky-100 rounded-xl transition"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* ヒーローバナー */}
        <div className="bg-sky-50/60 border border-sky-100/80 rounded-3xl p-8 space-y-3">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 bg-white px-3 py-1 rounded-full shadow-sm">
            <span>💖</span> ごはんのつながり、笑顔の輪。
          </span>
          <h2 className="text-2xl font-bold text-slate-800">
            長崎の子ども食堂とボランティアをつなぐ
          </h2>
          <p className="text-xs text-slate-400">
            活動予定の確認や参加申込が簡単に行えます。
          </p>
        </div>

        {/* メニュー (4つのカード) */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">メニュー</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/about"
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-4 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#00a6f4] flex items-center justify-center font-bold text-lg">
                📖
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">初めての方へ</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">活動案内と使い方</p>
              </div>
            </Link>

            <Link
              href="/shokudo"
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-4 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#00a6f4] flex items-center justify-center font-bold text-lg">
                🍱
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">子ども食堂一覧</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">参加食堂を見る</p>
              </div>
            </Link>

            <Link
              href="/mypage"
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-4 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#00a6f4] flex items-center justify-center font-bold text-lg">
                👤
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">マイページ・申込履歴</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">自分の参加予定</p>
              </div>
            </Link>

            <Link
              href="/checkin"
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-4 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-lg">
                📋
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">出席管理（当日用）</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">当日チェックイン</p>
              </div>
            </Link>
          </div>
        </div>

        {/* カレンダーエリア */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="text-sky-500">📅</span> 活動・開催予定カレンダー
            </h3>
          </div>

          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <h4 className="text-base font-bold text-slate-800">
              {year}年 {month}月
            </h4>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition">
                前月
              </button>
              <button className="px-4 py-1.5 bg-[#00a6f4] text-white rounded-xl text-xs font-bold shadow-sm">
                今月
              </button>
              <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition">
                次月
              </button>
            </div>
          </div>

          {/* 曜日 */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold mb-2">
            <div className="text-rose-500">日</div>
            <div className="text-slate-600">月</div>
            <div className="text-slate-600">火</div>
            <div className="text-slate-600">水</div>
            <div className="text-slate-600">木</div>
            <div className="text-slate-600">金</div>
            <div className="text-[#00a6f4]">土</div>
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1
              const event = events.find((e) => e.day === dayNum)

              return (
                <div
                  key={dayNum}
                  className="min-h-[85px] p-3 rounded-2xl bg-slate-50/50 border border-slate-100/60 flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-500">
                    {dayNum}
                  </span>

                  {event && (
                    <Link
                      href="/register"
                      className="block p-2 bg-[#00a6f4] hover:bg-sky-600 text-white rounded-xl text-[10px] font-bold transition shadow-sm space-y-0.5"
                    >
                      <p className="truncate">{event.title}</p>
                      <p className="text-[9px] opacity-80">{event.time}</p>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
