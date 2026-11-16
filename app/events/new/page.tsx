'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ADMIN_EMAILS = [
  'bb15125017@ms.nagasaki-u.ac.jp',
]

function NewEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [time, setTime] = useState('10:00 〜 14:00')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('10')
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // 1. URLのクエリパラメータ（?date=YYYY-MM-DD）から日付を取得してセット
    const dateParam = searchParams.get('date')
    if (dateParam) {
      setEventDate(dateParam)
    }

    // 2. 権限チェック
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || !session.user.email) {
        alert('ログインが必要です。')
        router.push('/')
        return
      }

      const email = session.user.email
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single()

      const role = prof?.role

      if (ADMIN_EMAILS.includes(email) || role === 'admin' || role === 'staff') {
        setAuthorized(true)
      } else {
        alert('このページにアクセスする権限がありません。')
        router.push('/')
      }
      setLoading(false)
    })
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !eventDate) {
      alert('イベント名と開催日は必須です。')
      return
    }

    const { error } = await supabase.from('events').insert([
      {
        title,
        event_date: eventDate,
        time,
        location,
        capacity: Number(capacity) || 10,
      },
    ])

    if (error) {
      alert('イベントの追加に失敗しました: ' + error.message)
    } else {
      alert('イベントを追加しました！')
      router.push('/')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400 font-bold">読み込み中...</div>
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">イベント新規追加</h1>
            <p className="text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link href="/" className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">新しいイベントの作成</h2>
            <p className="text-xs text-slate-400 font-medium">カレンダーに表示されるボランティア募集イベントを追加します。</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">イベント名（子ども食堂の名前など）</label>
              <input
                type="text"
                placeholder="例：冒険者ギルド 長崎の夜明け"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">開催日</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">開催時間</label>
              <input
                type="text"
                placeholder="例：10:00 〜 14:00"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">開催場所・住所</label>
              <input
                type="text"
                placeholder="例：長崎市西山3-31-16"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">募集人数（定員）</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
                required
              />
            </div>

            <div className="pt-3 flex gap-3">
              <Link
                href="/"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold text-center transition"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                追加する
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function NewEventPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400 font-bold">読み込み中...</div>}>
      <NewEventForm />
    </Suspense>
  )
}
