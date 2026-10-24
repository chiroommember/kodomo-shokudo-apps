'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function NewEventPage() {
  const [eventData, setEventData] = useState({
    title: '長崎大学前 こども食堂',
    date: '2026-11-05',
    time: '17:00〜19:00',
    location: '長崎市文教町',
    description: '子どもたちと一緒にご飯を食べたり、見守りや学習支援を行うボランティアです。',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('新しいイベントを追加しました！')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 my-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">イベント追加（スタッフ用）</h1>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          新しい子ども食堂の開催予定（イベント）を入力し、カレンダーに登録します。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 食堂名・イベント名 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              子ども食堂名・イベント名 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* 開催日 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              開催日 <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4] bg-white font-medium"
            />
          </div>

          {/* 時間 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              開催時間 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例: 17:00〜19:00"
              value={eventData.time}
              onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* 場所 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              開催場所 <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <input
              type="text"
              placeholder="例: 長崎市文教町 地域集会所"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* 詳細 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              活動内容・詳細 <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <textarea
              rows={3}
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00a6f4] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm mt-4"
          >
            イベントを追加する
          </button>
        </form>
      </div>
    </main>
  )
}
