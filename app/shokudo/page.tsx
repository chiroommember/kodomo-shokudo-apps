'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type ShokudoItem = {
  id: string
  no: number
  name: string
  district: string
  address: string
  contact_person: string
  phone: string
  email: string
  sns: string
  frequency: string
  contact_method: string
}

type EventItem = {
  id: string
  title: string
  event_date: string
  time: string
  location: string
  description?: string
  capacity: number
}

type RegistrationItem = {
  id: string
  event_id: string
  user_email: string
}

export default function ShokudoListPage() {
  const [shokudoList, setShokudoList] = useState<ShokudoItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 申込モーダル関連
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('14:00')
  const [partMessage, setPartMessage] = useState('')

  const hoursList = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00'
  ]

  const fetchData = async () => {
    const { data: sData } = await supabase.from('shokudo_list').select('*').order('no', { ascending: true })
    if (sData) setShokudoList(sData)

    const { data: eData } = await supabase.from('events').select('*').order('event_date', { ascending: true })
    if (eData) setEvents(eData)

    const { data: rData } = await supabase.from('registrations').select('*')
    if (rData) setRegistrations(rData)

    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        setIsLoggedIn(true)
        setUserEmail(session.user.email)
      }
    })
    fetchData()
  }, [])

  const handleOpenModal = (ev: EventItem) => {
    if (!isLoggedIn) {
      alert('参加するにはログインが必要です。')
      return
    }
    setSelectedEvent(ev)
    const times = ev.time ? ev.time.split(' 〜 ') : ['10:00', '14:00']
    setStartTime(times[0] || '10:00')
    setEndTime(times[1] || '14:00')
    setPartMessage('')
  }

  const submitApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !userEmail) return

    const formattedParticipationTime = `${startTime} 〜 ${endTime}`

    const { error } = await supabase.from('registrations').insert([
      {
        event_id: selectedEvent.id,
        user_email: userEmail,
        message: partMessage,
        participation_time: formattedParticipationTime,
      },
    ])

    if (error) {
      if (error.code === '23505') {
        alert('すでにこのイベントには申し込んでいます。')
      } else {
        alert('申込に失敗しました: ' + error.message)
      }
    } else {
      alert(`「${selectedEvent.title}」に参加申し込みしました！`)
      setSelectedEvent(null)
      setPartMessage('')
      fetchData()
    }
  }

  const handleCancelApply = async (eventId: string, eventTitle: string) => {
    if (!userEmail) return
    if (!confirm(`「${eventTitle}」の参加をキャンセルしますか？`)) return

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_email', userEmail)

    if (error) {
      alert('キャンセルに失敗しました: ' + error.message)
    } else {
      alert('参加申し込みをキャンセルしました')
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-base shadow-sm">ち</div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">子ども食堂一覧・イベント参加</h1>
            <p className="text-[10px] text-slate-400">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link href="/" className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        <div className="bg-[#f0f7ff] border border-sky-100 rounded-3xl p-5 space-y-1">
          <h2 className="text-xs sm:text-sm font-black text-[#0095f6]">📍 連携子ども食堂とボランティア募集</h2>
          <p className="text-[11px] text-slate-500">気になる子ども食堂のイベントを選んで、そのままボランティア参加にお申し込みいただけます。</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">読み込み中...</div>
        ) : shokudoList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
            子ども食堂データが登録されていません。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {shokudoList.map((shokudo) => {
              // この食堂の名前と一致するイベントを抽出
              const shokudoEvents = events.filter((ev) => ev.title === shokudo.name)

              return (
                <div key={shokudo.id} className="bg-white border border-sky-100 rounded-3xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2.5 py-0.5 rounded-full mr-2">No.{shokudo.no} / {shokudo.district}</span>
                      <h3 className="text-sm sm:text-base font-black text-slate-800 mt-1">{shokudo.name}</h3>
                    </div>
                    {shokudo.sns && (
                      <a href={shokudo.sns} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0095f6] font-bold underline hover:text-sky-600">
                        Instagram
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div><span className="font-bold text-slate-400">住所:</span> {shokudo.address || 'ー'}</div>
                    <div><span className="font-bold text-slate-400">活動頻度:</span> {shokudo.frequency || 'ー'}</div>
                  </div>

                  {/* 募集中のイベント一覧 */}
                  <div className="bg-sky-50/50 border border-sky-100/70 rounded-2xl p-3.5 space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0095f6] flex items-center gap-1">
                      <span>📅 募集中のボランティア活動</span>
                    </h4>

                    {shokudoEvents.length === 0 ? (
                      <p className="text-[11px] text-slate-400 pl-1">現在、登録されている直近のイベントはありません。</p>
                    ) : (
                      <div className="space-y-2">
                        {shokudoEvents.map((ev) => {
                          const eventRegs = registrations.filter((r) => r.event_id === ev.id)
                          const count = eventRegs.length
                          const isAlreadyApplied = userEmail ? eventRegs.some((r) => r.user_email === userEmail) : false
                          const isFull = count >= ev.capacity

                          return (
                            <div key={ev.id} className="bg-white border border-sky-100 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                              <div className="space-y-0.5">
                                <div className="text-xs font-black text-slate-800">
                                  {ev.event_date} ({ev.time})
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  場所: {ev.location} / 定員: {count} / {ev.capacity}人
                                </div>
                                {ev.description && (
                                  <div className="text-[10px] text-slate-400 pt-0.5">{ev.description}</div>
                                )}
                              </div>

                              <div className="flex items-center justify-end">
                                {isAlreadyApplied ? (
                                  <button onClick={() => handleCancelApply(ev.id, ev.title)} className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition cursor-pointer">
                                    申込済み (取消)
                                  </button>
                                ) : isFull ? (
                                  <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold text-slate-400">満員</span>
                                ) : (
                                  <button onClick={() => handleOpenModal(ev)} className="px-4 py-1.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer">
                                    参加する
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* 参加申込モーダル */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">イベント参加お申し込み</h3>
              <p className="text-xs font-bold text-[#0095f6]">{selectedEvent.title} ({selectedEvent.event_date})</p>
            </div>

            <form onSubmit={submitApply} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">参加希望時間</label>
                <div className="flex items-center gap-2">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  >
                    {hoursList.map((time) => (
                      <option key={`p-start-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                  <span className="text-xs font-bold text-slate-400">〜</span>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  >
                    {hoursList.map((time) => (
                      <option key={`p-end-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">ひとことメッセージ（任意）</label>
                <textarea
                  rows={3}
                  placeholder="例：よろしくお願いいたします！"
                  value={partMessage}
                  onChange={(e) => setPartMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  やめる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  申し込む
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
