'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type ProfileType = {
  id: string
  email: string
  name?: string
  role?: string
  phone?: string
  affiliation?: string
  emergency_contact?: string
}

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
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAffiliation, setEditAffiliation] = useState('')
  const [editEmergency, setEditEmergency] = useState('')

  const fetchProfileAndRegs = async (id: string, email: string) => {
    const { data: profData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profData) {
      setProfile(profData)
      setEditName(profData.name || '')
      setEditPhone(profData.phone || '')
      setEditAffiliation(profData.affiliation || '')
      setEditEmergency(profData.emergency_contact || '')
    }

    const { data: regData } = await supabase
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

    if (regData) {
      setRegistrations(regData as unknown as RegistrationWithEvent[])
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUserEmail(session.user.email || null)
        setUserId(session.user.id)
        fetchProfileAndRegs(session.user.id, session.user.email || '')
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name: editName,
        phone: editPhone,
        affiliation: editAffiliation,
        emergency_contact: editEmergency,
      })
      .eq('id', userId)

    if (error) {
      alert('更新に失敗しました: ' + error.message)
    } else {
      alert('プロフィール情報を更新しました！')
      setIsEditOpen(false)
      if (userEmail) fetchProfileAndRegs(userId, userEmail)
    }
  }

  const handleCancel = async (eventId: string, title: string) => {
    if (!userEmail || !userId) return
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
      fetchProfileAndRegs(userId, userEmail)
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'サークル員（全権管理者）'
      case 'staff':
        return '子ども食堂 運営スタッフ'
      default:
        return 'ボランティア参加希望'
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-lg leading-tight">マイページ</h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link href="/" className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-sky-100/70 shadow-2xs space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">マイページ・アカウント設定</h2>
              <p className="text-xs text-slate-400 font-medium">登録情報の確認・変更および参加予定イベントの管理</p>
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-5 py-2 bg-[#0095f6] hover:bg-sky-500 text-white rounded-full text-xs font-bold shadow-2xs transition cursor-pointer self-start sm:self-auto"
            >
              編集する
            </button>
          </div>

          <div className="bg-sky-50/40 border border-sky-100/80 rounded-3xl p-4 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#0095f6]">登録プロフィール設定</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-100/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">お名前</span>
                <p className="text-xs font-bold text-slate-700">{profile?.name || '（未設定）'}</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-100/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">ご区分</span>
                <p className="text-xs font-bold text-[#0095f6]">{getRoleLabel(profile?.role)}</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-100/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">メールアドレス</span>
                <p className="text-xs font-bold text-slate-700 truncate">{userEmail || '（未設定）'}</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-100/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">電話番号</span>
                <p className="text-xs font-bold text-slate-700">{profile?.phone || '（未設定）'}</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-100/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">所属・学校名・学年</span>
                <p className="text-xs font-bold text-slate-700">{profile?.affiliation || '（未設定）'}</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-100/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">緊急連絡先・アレルギー等</span>
                <p className="text-xs font-bold text-slate-700">{profile?.emergency_contact || '（未設定）'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400">📅 自分の参加予定イベント履歴</h3>

            {loading ? (
              <p className="text-xs text-slate-400">読み込み中...</p>
            ) : registrations.length === 0 ? (
              <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                現在、参加予定のイベントはありません。
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-4 sm:p-5 bg-white border border-sky-100 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition self-start sm:self-center shrink-0 cursor-pointer"
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

      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">プロフィール情報の編集</h3>
              <p className="text-xs text-slate-400">登録情報を更新します。</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">お名前</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="例：長崎 太郎"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">電話番号</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="例：090-1234-5678"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">所属・学校名・学年</label>
                <input
                  type="text"
                  value={editAffiliation}
                  onChange={(e) => setEditAffiliation(e.target.value)}
                  placeholder="例：長崎大学 教育学部 2年"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">緊急連絡先・アレルギー等</label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  placeholder="例：090-9999-9999 / なし"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
