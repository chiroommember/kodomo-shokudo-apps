'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
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

      if (prof?.role === 'admin' || prof?.role === 'staff') {
        setAuthorized(true)
      } else {
        alert('管理者権限が必要です。')
        router.push('/')
      }
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400">読み込み中...</div>
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
            <h1 className="font-bold text-slate-900 text-lg leading-tight">サークル運営管理ポータル</h1>
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

      <main className="max-w-4xl mx-auto px-6 pt-10 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">管理メニュー</h2>
          <p className="text-xs text-slate-400">行いたい作業を選択してください。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 子ども食堂・活動管理へのリンク */}
          <Link
            href="/manage"
            className="bg-white border border-sky-100 hover:border-sky-300 p-6 rounded-3xl shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="w-12 h-12 bg-sky-50 text-[#0095f6] rounded-2xl flex items-center justify-center text-xl font-bold group-hover:bg-[#0095f6] group-hover:text-white transition">
              📋
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">子ども食堂・活動管理</h3>
              <p className="text-xs text-slate-400 mt-1">提携食堂の連絡先やコツ、活動日のチェックリストを確認・更新します。</p>
            </div>
          </Link>

          {/* ユーザー権限管理へのリンク */}
          <Link
            href="/admin/users"
            className="bg-white border border-sky-100 hover:border-sky-300 p-6 rounded-3xl shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:bg-purple-600 group-hover:text-white transition">
              👥
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">ユーザー権限管理</h3>
              <p className="text-xs text-slate-400 mt-1">サークル員の追加や、一般メンバーの権限（管理者・スタッフ）を変更します。</p>
            </div>
          </Link>

          {/* 申込者一覧へのリンク */}
          <Link
            href="/admin/registrations"
            className="bg-white border border-sky-100 hover:border-sky-300 p-6 rounded-3xl shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition">
              📝
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">ボランティア申込者一覧</h3>
              <p className="text-xs text-slate-400 mt-1">イベントごとの参加申込状況を確認・管理します。</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
