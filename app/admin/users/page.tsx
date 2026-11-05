'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type ProfileItem = {
  id: string
  email: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ProfileItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">管理者画面 - ユーザー管理</h1>
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

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <div className="space-y-1">
            登録されたユーザー一覧
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">読み込み中...</p>
          ) : users.length === 0 ? (
            <p className="text-xs text-slate-400">登録されているユーザーがいません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                    <th className="py-3 px-4">メールアドレス</th>
                    <th className="py-3 px-4">権限</th>
                    <th className="py-3 px-4">登録日時</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-bold text-slate-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-sky-50 text-[#0095f6] rounded-full font-bold text-[10px]">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(user.created_at).toLocaleString('ja-JP')}
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
