'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: '長崎 太郎', email: 'taro@example.com', role: 'ボランティア参加希望' },
    { id: 2, name: '出島 花子', email: 'hanako@example.com', role: '子ども食堂 運営スタッフ' },
    { id: 3, name: '平和 学', email: 'manabu@example.com', role: 'サークル員（全権限管理者）' },
  ])

  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    alert('権限を更新しました！')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">ユーザー権限管理（サークル員専用）</h1>
            <p className="text-xs text-slate-400">登録ユーザーの権限（ロール）を変更・付与できます</p>
          </div>
          <Link href="/" className="text-xs text-sky-500 font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold">
                <th className="py-3 px-2">お名前</th>
                <th className="py-3 px-2">メールアドレス</th>
                <th className="py-3 px-2">現在の権限</th>
                <th className="py-3 px-2 text-right">権限の変更</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-2 font-bold text-slate-800">{u.name}</td>
                  <td className="py-4 px-2 text-slate-500">{u.email}</td>
                  <td className="py-4 px-2">
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
                  <td className="py-4 px-2 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
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
    </main>
  )
}
