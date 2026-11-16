'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ADMIN_EMAILS = [
  'bb15125017@ms.nagasaki-u.ac.jp',
]

type RegistrationItem = {
  id: string
  user_email: string
  participation_time?: string
  message?: string
  status?: string
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

export default function CheckinPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])
  const [profilesMap, setProfilesMap] = useState<{ [email: string]: string }>({})

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || !session.user.email) {
        alert('管理者またはスタッフログインが必要です。')
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
        fetchData()
      } else {
        alert('このページにアクセスする権限がありません。')
        router.push('/')
      }
      setLoading(false)
    })
  }, [router])

  const fetchData = async () => {
    // プロフィールマップの取得（メールアドレス -> 名前）
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

    // 申込データの取得（イベント情報結合）
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        user_email,
        participation_time,
        message,
        status,
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
      setRegistrations(data as unknown as RegistrationItem[])
    }
  }

  // 参加ステータスの切り替え（参加 ⇄ 未参加）
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === '参加' ? '未参加' : '参加'
    const { error } = await supabase
      .from('registrations')
      .update({ status: nextStatus })
      .eq('id', id)

    if (error) {
      alert('ステータスの更新に失敗しました: ' + error.message)
    } else {
      fetchData()
    }
  }

  // イベントごとにグループ化
  const groupedByEvent: { [eventTitle: string]: RegistrationItem[] } = {}
  registrations.forEach((reg) => {
    const eventName = reg.events?.title || '未分類のイベント'
    if (!groupedByEvent[eventName]) {
      groupedByEvent[eventName] = []
    }
    groupedByEvent[eventName].push(reg)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400 font-bold">
        読み込み中...
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-lg leading-tight">出席管理（当日用）</h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#0095f6] bg-sky-50 hover:bg-sky-100 rounded-full transition">
            管理ポータルへ
          </Link>
          <Link href="/" className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">イベント別 出席・参加チェック</h2>
          <p className="text-xs text-slate-400 font-medium">イベントごとに参加申込者をリスト化し、ボタン一つで「参加 / 未参加」を切り替えられます。</p>
        </div>

        {Object.keys(groupedByEvent).length === 0 ? (
          <div className="p-8 bg-white border border-slate-100 rounded-3xl text-center text-xs text-slate-400">
            現在、イベントの申込データはありません。
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByEvent).map(([eventTitle, regs]) => {
              const eventInfo = regs[0]?.events
              return (
                <div key={eventTitle} className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-1">
                    <div>
                      <h3 className="text-base font-black text-slate-800">{eventTitle}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        開催日: {eventInfo?.event_date || '未設定'} ({eventInfo?.time || '時間未設定'}) / 場所: {eventInfo?.location || '未設定'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-sky-50 text-[#0095f6] rounded-full text-xs font-bold self-start sm:self-auto">
                      申込人数: {regs.length}人
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {regs.map((reg) => {
                      const userName = profilesMap[reg.user_email] || reg.user_email
                      const status = reg.status || '未参加'
                      return (
                        <div key={reg.id} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-800">{userName}</span>
                            </div>
                            <div className="text-xs text-slate-600">
                              希望時間: <span className="font-bold text-[#0095f6]">{reg.participation_time || '全時間'}</span>
                              {reg.message && <span className="ml-3 text-slate-500">💬 {reg.message}</span>}
                            </div>
                          </div>

                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleToggleStatus(reg.id, status)}
                              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                                status === '参加'
                                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {status === '参加' ? '参加中' : '未参加'}
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
