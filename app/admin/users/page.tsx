'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: '管理者（あなた）', email: 'admin@example.com', role: 'サークル員（全権限管理者）' },
    { id: 2, name: '長崎 太郎', email: 'taro@example.com', role: 'ボランティア参加希望' },
    { id: 3, name: '出島 花子', email: 'hanako@example.com', role: '子ども食堂 運営スタッフ' },
  ])

  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    alert('権限を更新しました！')
  }

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return

    const newUser = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: 'サークル員（全権限管理者）',
    }

    setUsers([newUser, ...users])
    setNewName('')
    setNewEmail('')
    alert(`${newName} 様をサークル員（管理者）として登録しました！`)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8 my-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">ユーザー権限管理（管理者専用）</h1>
            <p className="text-xs text-slate-400 mt-0.5">サークル員（管理者）の追加や一般ユーザーの権限変更ができます</p>
          </div>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        {/* 自分のアカウントを新規管理者として登録するフォーム */}
        <div className="p-5 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
          <p className="text-xs font-bold text-sky-900">➕ 自分のアカウントを管理者として追加・登録</p>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="お名前"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4] bg-white"
            />
            <input
              type="email"
              placeholder="メールアドレス"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4] bg-white"
            />
            <button
              type="submit"
              className="py-2.5 px-4 bg-[#00a6f4] hover:bg-sky-600 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              管理者権限を付与
            </button>
          </form>
        </div>

        {/* ユーザー一覧 */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500">ユーザー一覧と権限の切り替え</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="py-3 px-3">お名前</th>
                  <th className="py-3 px-3">メールアドレス</th>
                  <th className="py-3 px-3">現在の権限</th>
                  <th className="py-3 px-3 text-right">権限の変更</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-3 font-bold text-slate-800">{u.name}</td>
                    <td className="py-4 px-3 text-slate-500">{u.email}</td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role.includes('サークル員')
                            ? 'bg-purple-100 text-purple-700'
                            : u.role.includes('運営スタッフ')
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
                      >
                        <option value="ボランティア参加希望">ボランティア参加希望</option>
                        <option value="子ども食堂 運営スタッフ">子ども食堂 運営スタッフ</option>
                        <option value="サークル員（全権限管理者）">サークル員（全権限管理者）</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
