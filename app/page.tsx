'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1))

  // カレンダー用サンプルイベントデータ
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

        {/* 右上のログイン・新規登録ボタン */}
        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-sm transition"
          >
            ログイン
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition"
          >
            新規登録
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* ヒーローバナー */}
        <div className="bg-sky-50/70 border border-sky-100/80 rounded-3xl p-8 space-y-3">
          <span className="inline-flex items-center text-xs font-semibold text-sky-700 bg-white px-3 py-1 rounded-full shadow-sm">
            💖 ごはんのつながり、笑顔の輪。
          </span>
          <h2 className="text-2xl font-black text-sky-950">
            長崎の子ども食堂とボランティアをつなぐ
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            活動予定の確認や参加申込が簡単に行えます。
          </p>
        </div>

        {/* メニュー（4つのカード） */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">メニュー</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/about"
              className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                📖
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">初めての方へ</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">活動案内と使い方</p>
              </div>
            </Link>

            <Link
              href="/shokudo"
              className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                🍱
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">子ども食堂一覧</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">参加食堂を見る</p>
              </div>
            </Link>

            <Link
              href="/mypage"
              className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                👤
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">マイページ・申込履歴</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">自分の参加予定</p>
              </div>
            </Link>

            <Link
              href="/checkin"
              className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-sky-200 transition space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                📋
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">出席管理（当日用）</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">当日チェックイン</p>
              </div>
            </Link>
          </div>
        </div>

        {/* カレンダーエリア */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <span>📅</span> 活動・開催予定カレンダー
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-slate-800 mr-2">
                {year}年 {month}月
              </span>
              <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-bold transition">
                前月
              </button>
              <button className="px-3 py-1 bg-sky-500 text-white rounded-xl text-[10px] font-bold shadow-sm">
                今月
              </button>
              <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-bold transition">
                次月
              </button>
            </div>
          </div>

          {/* 曜日 */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 py-1">
            <div className="text-rose-400">日</div>
            <div>月</div>
            <div>火</div>
            <div>水</div>
            <div>木</div>
            <div>金</div>
            <div className="text-sky-400">土</div>
          </div>

          {/* マス目 */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1
              const event = events.find((e) => e.day === dayNum)

              return (
                <div
                  key={dayNum}
                  className={`min-h-[85px] p-2 rounded-2xl border flex flex-col justify-between ${
                    event
                      ? 'bg-sky-50/40 border-sky-200'
                      : 'bg-slate-50/40 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-600">
                      {dayNum}
                    </span>
                    <Link
                      href="/register"
                      className="text-[9px] font-bold text-sky-500 bg-sky-100/70 hover:bg-sky-200 px-1.5 py-0.5 rounded-lg transition"
                    >
                      + 追加
                    </Link>
                  </div>

                  {event && (
                    <Link
                      href="/register"
                      className="block p-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[10px] font-bold text-left transition shadow-sm space-y-0.5"
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
