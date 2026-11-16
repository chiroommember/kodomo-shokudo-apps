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
  } | null
}

type ProfileItem = {
  email: string
  name: string
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])
  const [profilesMap, setProfilesMap] = useState<{ [email: string]: string }>({})
  const [loading, setLoading] = useState(true)

  const fetchAllRegistrations = async () => {
    // プロフィール一覧を取得して、メールアドレス -> 名前の対応マップを作る
    const { data: pData } = await supabase.from('profiles').select('email, name')
    if (pData) {
      const map: { [email: string]: string } = {}
      pData.forEach((p: ProfileItem) => {
        if (p.email && p.name) {
          map[p.email] = p.name
        }
      })
      setProfilesMap(map)
    }

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

  // 参加者（申込）の削除・取消処理
  const handleCancelRegistration = async (registrationId: string, userName: string, eventTitle: string) => {
    if (!confirm(`「${eventTitle}`}」の ${userName}さんの申込を解除（削除）しますか？`)) return

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', registrationId)

    if (error) {
      alert('解除に失敗しました: ' + error.message)
    } else {
      alert('参加申込を解除しました。')
      fetchAllRegistrations()
    }
  }

  // イベントごとに申込データをグループ化する
  const groupedByEvent: { [eventTitle: string]: RegistrationDetail[] } = {}
  registrations.forEach((reg) => {
    const eventName = reg.events?.title || '未分類・終了したイベント'
    if (!groupedByEvent[eventName]) {
      groupedByEvent[eventName] = []
    }
    groupedByEvent[eventName].push(reg)
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">管理者画面 - 出席・申込者管理</h1>
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
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">イベント別 出席・申込者リスト</h2>
          <p className="text-xs text-slate-400 font-medium">イベントごとに参加メンバーを一覧表示し、いつでも参加の取消や管理ができます。</p>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">読み込み中...</p>
        ) : Object.keys(groupedByEvent).length === 0 ? (
          <div className="p-8 bg-white border border-slate-100 rounded-3xl text-center text-xs text-slate-400">
            現在、参加申込みはありません。
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByEvent).map(([eventTitle, regs]) => {
              const firstEventInfo = regs[0]?.events
              return (
                <div key={eventTitle} className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-4">
                  {/* イベントごとのヘッダー */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-1">
                    <div>
                      <h3 className="text-base font-black text-slate-800">{eventTitle}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        開催日: {firstEventInfo?.event_date || '未設定'} ({firstEventInfo?.time || '時間未設定'}) / 場所: {firstEventInfo?.location || '未設定'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-sky-50 text-[#0095f6] rounded-full text-xs font-bold self-start sm:self-auto">
                      申込人数: {regs.length}人
                    </span>
                  </div>

                  {/* 参加者の箇条書き・リスト */}
                  <div className="space-y-2.5">
                    {regs.map((reg) => {
                      const userName = profilesMap[reg.user_email] || reg.user_email
                      return (
                        <div key={reg.id} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-800">{userName}</span>
                              <span className="px-2.5 py-0.5 bg-white border border-sky-100 text-[#0095f6] rounded-lg text-xs font-bold">
                                希望時間: {reg.participation_time || '全時間'}
                              </span>
                            </div>
                            {reg.message && (
                              <p className="text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-100 inline-block">
                                💬 ひとこと: {reg.message}
                              </p>
                            )}
                            <div className="text-[10px] text-slate-400">
                              申込日時: {new Date(reg.created_at).toLocaleString('ja-JP')}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCancelRegistration(reg.id, userName, eventTitle)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              参加を取り消す
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
