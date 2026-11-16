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

export default function ShokudoListPage() {
  const [shokudoList, setShokudoList] = useState<ShokudoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShokudo = async () => {
      const { data, error } = await supabase
        .from('shokudo_list')
        .select('*')
        .order('no', { ascending: true })

      if (!error && data) {
        setShokudoList(data)
      }
      setLoading(false)
    }

    fetchShokudo()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-base shadow-sm">ち</div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">子ども食堂一覧</h1>
            <p className="text-[10px] text-slate-400">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link href="/" className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        <div className="bg-[#f0f7ff] border border-sky-100 rounded-3xl p-5 space-y-1">
          <h2 className="text-xs sm:text-sm font-black text-[#0095f6]">📍 連携子ども食堂のご案内</h2>
          <p className="text-[11px] text-slate-500">サークルがボランティアとして活動・提携している長崎県内の子ども食堂一覧です。</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">読み込み中...</div>
        ) : shokudoList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
            子ども食堂データが登録されていません。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {shokudoList.map((item) => (
              <div key={item.id} className="bg-white border border-sky-100 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#0095f6]">No.{item.no} {item.name}</span>
                  <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2.5 py-0.5 rounded-full">{item.district}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-600">
                  <div><span className="font-bold text-slate-400">住所:</span> {item.address || 'ー'}</div>
                  <div><span className="font-bold text-slate-400">活動頻度:</span> {item.frequency || 'ー'}</div>
                  <div><span className="font-bold text-slate-400">連絡手段:</span> {item.contact_method || 'ー'}</div>
                  {item.sns && (
                    <div>
                      <span className="font-bold text-slate-400">SNS:</span>{' '}
                      <a href={item.sns} target="_blank" rel="noopener noreferrer" className="text-[#0095f6] underline hover:text-sky-600">
                        Instagram / リンク
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
