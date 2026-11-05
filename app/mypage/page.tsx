'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type RegistrationWithEvent = {
  id: string
  event_id: string
  user_email: string
  message?: string
  participation_time?: string
  created_at: string
  events: {
    title: string
    event_date: string
    time: string
    location: string
  }
}

export default function MyPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMyRegistrations = async (email: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        event_id,
        user_email,
        message,
        participation_time,
        created_at,
        events (
          title,
          event_date,
          time,
          location
        )
      `)
      .eq('user_email', email)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRegistrations(data as unknown as RegistrationWithEvent[])
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        setUserEmail(session.user.email)
        fetchMyRegistrations(session.user.email)
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleCancel = async (eventId: string, title: string) => {
    if (!userEmail) return
    if (!confirm(`「${title}」の参加をキャンセルしますか？`)) return

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_email', userEmail)

    if (error) {
      alert('キャンセルに失敗しました: ' + error.message)
    } else {
      alert('キャンセルしました')
      fetchMyRegistrations(userEmail)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">マイページ</h1>
            <p className="text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link href="/" className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      {/* メイン */}
      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-8">
          
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">マイページ・アカウント設定</h2>
            <p className="text-xs text-slate-400 font-medium">登録情報の確認および参加予定イベントの管理が行えます。</p>
          </div>

          {/* プロフィール表示カード */}
          <div className="bg-sky-50/50 border border-sky-100/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#0095f6]">ログイン中のアカウント</h3>
            <div className="text-xs font-bold text-slate-700">
              {userEmail ? userEmail : 'ログインしていません'}
            </div>
          </div>

          {/* 参加予定イベント履歴 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400">📅 自分の参加予定イベント履歴</h3>

            {loading ? (
              <p className="text-xs text-slate-400">読み込み中...</p>
            ) : registrations.length === 0 ? (
              <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                現在、参加予定のイベントはありません。カレンダーから参加してみてください！
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-5 bg-white border border-sky-100 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">{reg.events?.title || 'イベント'}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px]">申込済み</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        開催日: {reg.events?.event_date}（{reg.events?.time}）
                      </p>
                      <p className="text-xs text-slate-400">
                        場所: {reg.events?.location}
                      </p>
                      <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                        <p><strong className="text-slate-700">希望時間:</strong> {reg.participation_time || '未設定'}</p>
                        <p><strong className="text-slate-700">ひとこと:</strong> {reg.message || 'なし'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancel(reg.event_id, reg.events?.title)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition self-start sm:self-center shrink-0"
                    >
                      参加をキャンセル
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
