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
  name?: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ProfileItem[]>([])
  const [loading, setLoading] = useState(true)

  // 追加フォーム用のステート
  const [inputName, setInputName] = useState('')
  const [inputEmail, setInputEmail] = useState('')

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

  useEffect(() => {
    fetchUsers()
  }, [])

  // 権限の変更処理
  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      alert('権限の変更に失敗しました: ' + error.message)
    } else {
      alert('権限を更新しました')
      fetchUsers()
    }
  }

  // 手動でアカウント（お名前・メール）を追加登録する処理
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputEmail) return

    // すでに存在するか確認、または簡易追加
    const { error } = await supabase.from('profiles').insert([
      {
        email: inputEmail,
        name: inputName,
        role: 'admin',
      },
    ])

    if (error) {
      alert('登録に失敗しました: ' + error.message)
    } else {
      alert('管理者として追加しました！')
      setInputName('')
      setInputEmail('')
      fetchUsers()
    }
  }

  // ロールに応じたバッジの色とラベルを返す
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full font-bold text-[11px]">サークル員（全権管理者）</span>
      case 'staff':
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-bold text-[11px]">子ども食堂 運営スタッフ</span>
      default:
        return <span className="px-3 py-1 bg-sky-50 text-[#0095f6] rounded-full font-bold text-[11px]">ボランティア参加希望</span>
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">ちるーむ</h1>
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
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-8">
          
          {/* タイトルエリア */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">ユーザー権限管理（管理者専用）</h2>
              <p className="text-xs text-slate-400 font-medium">サークル員（管理者）の追加や一般ユーザーの権限変更ができます</p>
            </div>
          </div>

          {/* アカウント追加フォーム */}
          <div className="bg-sky-50/50 border border-sky-100/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#0095f6] flex items-center gap-1.5">
              <span>+ 自分のアカウントを管理者として追加・登録</span>
            </h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="お名前（例：長崎 太郎）"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0095f6]"
                required
              />
              <input
                type="email"
                placeholder="メールアドレス"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0095f6]"
                required
              />
              <button
                type="submit"
                className="py-2 px-4 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition"
              >
                管理者権限を付与
              </button>
            </form>
          </div>

          {/* ユーザー一覧テーブル */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400">ユーザー一覧と権限の切り替え</h3>

            {loading ? (
              <p className="text-xs text-slate-400">読み込み中...</p>
            ) : users.length === 0 ? (
              <p className="text-xs text-slate-400">登録されているユーザーがいません。</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                      <th className="py-3 px-4">お名前</th>
                      <th className="py-3 px-4">メールアドレス</th>
                      <th className="py-3 px-4">現在の権限</th>
                      <th className="py-3 px-4 text-right">権限の変更</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {user.name || '（未設定）'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">{user.email}</td>
                        <td className="py-3.5 px-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={user.role || 'volunteer'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0095f6] font-bold text-slate-700"
                          >
                            <option value="admin">サークル員（全権管理者）</option>
                            <option value="staff">子ども食堂 運営スタッフ</option>
                            <option value="volunteer">ボランティア参加希望</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
