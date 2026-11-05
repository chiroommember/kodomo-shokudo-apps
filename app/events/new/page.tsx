'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function NewEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('14:00')

  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState('10')
  const [loading, setLoading] = useState(false)

  // 選択用の時間リスト
  const hoursList = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formattedTime = `${startTime} 〜 ${endTime}`

    const { error } = await supabase.from('events').insert([
      {
        title,
        event_date: eventDate,
        time: formattedTime,
        location,
        description,
        capacity: parseInt(capacity, 10),
      },
    ])

    setLoading(false)

    if (error) {
      alert('保存に失敗しました: ' + error.message)
    } else {
      alert('イベントを追加しました！')
      router.push('/')
    }
  }

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
        <Link
          href="/"
          className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition"
        >
          トップへ戻る
        </Link>
      </header>

      {/* メインフォーム */}
      <main className="max-w-xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              新しい活動・イベントの追加
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              カレンダーに表示する子ども食堂の開催情報を入力してください。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* イベント名 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">イベント名（子ども食堂名など）</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：〇〇子ども食堂"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50"
              />
            </div>

            {/* 開催日 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">開催日</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50"
              />
            </div>

            {/* 時間（セレクトボックス選択式） */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">時間</label>
              <div className="flex items-center gap-2">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50"
                >
                  {hoursList.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-bold text-slate-400">〜</span>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50"
                >
                  {hoursList.map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 場所 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">場所</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例：長崎市市民センター 1階ホール"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50"
              />
            </div>

            {/* 募集人数（定員） */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">募集人数（定員）</label>
              <input
                type="number"
                required
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="例：10"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50"
              />
              <p className="text-[10px] text-slate-400">
                ※ 申込数が定員に達した場合、自動的に受付終了となります。
              </p>
            </div>

            {/* 詳細 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">詳細・持ち物など</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="当日の流れや持ち物、注意事項などを記入してください"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0095f6] bg-slate-50/50 resize-none"
              />
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm transition mt-2"
            >
              {loading ? '保存中...' : 'イベントを追加する'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
