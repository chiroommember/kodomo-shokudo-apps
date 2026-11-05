'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type RegistrationDetail = {
  id: string
  user_email: string
  message?: string
  participation_time?: string
  created_at: string
  events: {
    id: string
    title: string
    event_date: string
    time: string
    location: string
  }
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllRegistrations = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        user_email,
        message,
        participation_time,
        created_at,
        events (
          id,
          title,
          event_date,
          time,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRegistrations(data as unknown as RegistrationDetail[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAllRegistrations()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">管理者画面 - 申込者一覧</h1>
            <p className="text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/users"
            className="px-4 py-2 text-xs font-bold text-[#0095f6] bg-sky-50 hover:bg-sky-100 rounded-full transition"
          >
            ユーザー権限管理
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition"
          >
            トップへ戻る
          </Link>
        </div>
      </header>

      {/* メイン */}
      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">イベント参加申込者一覧</h2>
            <p className="text-xs text-slate-400 font-medium">ボランティアメンバーの参加申込み状況やメッセージを確認できます。</p>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">読み込み中...</p>
          ) : registrations.length === 0 ? (
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400">
              現在、参加申込みはありません。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                    <th className="py-3 px-4">イベント名 / 開催日</th>
                    <th className="py-3 px-4">申込者メールアドレス</th>
                    <th className="py-3 px-4">希望参加時間</th>
                    <th className="py-3 px-4">ひとことメッセージ</th>
                    <th className="py-3 px-4">申込日時</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <div>{reg.events?.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{reg.events?.event_date}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#0095f6]">
                        {reg.user_email}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-700">
                        <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg text-[11px]">
                          {reg.participation_time || '全時間'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 max-w-xs">
                        {reg.message ? (
                          <span className="p-2 bg-slate-50 rounded-xl block text-[11px]">{reg.message}</span>
                        ) : (
                          <span className="text-slate-300">なし</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-[11px]">
                        {new Date(reg.created_at).toLocaleString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
