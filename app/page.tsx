'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)) // 2026年10月

  // 10月のカレンダー用サンプルデータ
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
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sky-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-extrabold text-sky-950 text-base leading-tight">ちるーむ</h1>
            <p className="text-[10px] text-slate-400">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>

        {/* 右上のオプションボタン */}
        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-sm transition"
          >
            新規登録
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* メニューショートカット */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/shokudo" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition text-center space-y-1">
            <span className="text-xl">🍱</span>
            <p className="text-xs font-bold text-slate-700">子ども食堂一覧</p>
          </Link>
          <Link href="/mypage" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition text-center space-y-1">
            <span className="text-xl">👤</span>
            <p className="text-xs font-bold text-slate-700">マイページ・履歴</p>
          </Link>
          <Link href="/checkin" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition text-center space-y-1">
            <span className="text-xl">📋</span>
            <p className="text-xs font-bold text-slate-700">出席管理（当日用）</p>
          </Link>
          <Link href="/about" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition text-center space-y-1">
            <span className="text-xl">📖</span>
            <p className="text-xs font-bold text-slate-700">初めての方へ</p>
          </Link>
        </div>

        {/* でっかいカレンダーエリア */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-800">
              📅 {year}年 {month}月 イベントカレンダー
            </h2>
            <span className="text-xs text-slate-400">イベントを押して参加申込</span>
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
            <div className="text-rose-400">日</div>
            <div>月</div>
            <div>火</div>
            <div>水</div>
            <div>木</div>
            <div>金</div>
            <div className="text-sky-400">土</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1
              const event = events.find((e) => e.day === dayNum)

              return (
                <div
                  key={dayNum}
                  className={`min-h-[90px] p-2 rounded-2xl border flex flex-col justify-between ${
                    event
                      ? 'bg-sky-50/50 border-sky-200'
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-600">
                    {dayNum}
                  </span>

                  {event && (
                    <Link
                      href="/register"
                      className="block p-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[10px] font-bold text-left transition shadow-sm space-y-0.5"
                    >
                      <p className="truncate">{event.title}</p>
                      <p className="text-[9px] opacity-80">{event.time}</p>
                      <span className="inline-block mt-1 bg-white/20 px-1 py-0.5 rounded text-[8px]">
                        申込へ ➔
                      </span>
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
