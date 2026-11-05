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

export default function CheckinPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

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
      } else {
        alert('このページにアクセスする権限がありません。')
        router.push('/')
      }
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400 font-bold">
        権限を確認中...
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
        <Link href="/" className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">当日出席・チェックイン管理</h2>
            <p className="text-xs text-slate-400 font-medium">イベント当日に参加メンバーの出席状況を管理する画面です。</p>
          </div>

          <div className="p-8 bg-sky-50/50 border border-sky-100 rounded-2xl text-center space-y-2">
            <p className="text-xs font-bold text-[#0095f6]">出席管理機能は現在構築中です</p>
            <p className="text-[11px] text-slate-500">当日の QRコード読み取り や 出席チェックリスト機能が順次追加されます。</p>
          </div>
        </div>
      </main>
    </div>
  )
}
