'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function CheckinStaffPage() {
  // サンプルの参加予定者リスト
  const [attendees, setAttendees] = useState([
    { id: 1, name: '長崎 太郎', role: 'ボランティア参加希望', status: '未確認' },
    { id: 2, name: '出島 花子', role: 'ボランティア参加希望', status: '出席' },
    { id: 3, name: '平和 学', role: '運営スタッフ', status: '欠席' },
  ])

  const handleStatusChange = (id: number, newStatus: string) => {
    setAttendees(attendees.map(a => a.id === id ? { ...a, status: newStatus } : a))
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 my-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">出席管理（スタッフ用）</h1>
            <p className="text-xs text-slate-400 mt-0.5">当日の参加状況を確認し、スタッフが出席・欠席の状態を変更できます</p>
          </div>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        {/* 対象イベント情報 */}
        <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-sky-900">対象イベント</p>
            <p className="text-xs text-slate-600 mt-0.5">📅 2026年10月10日（土） 17:00〜 「長崎大学前 こども食堂」</p>
          </div>
        </div>

        {/* 参加者一覧テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold">
                <th className="py-3 px-3">お名前</th>
                <th className="py-3 px-3">区分</th>
                <th className="py-3 px-3">現在の状態</th>
                <th className="py-3 px-3 text-right">ステータス変更</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendees.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-3 font-bold text-slate-800">{a.name}</td>
                  <td className="py-4 px-3 text-slate-500">{a.role}</td>
                  <td className="py-4 px-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        a.status === '出席'
                          ? 'bg-emerald-100 text-emerald-700'
                          : a.status === '欠席'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleStatusChange(a.id, '出席')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        a.status === '出席'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      出席
                    </button>
                    <button
                      onClick={() => handleStatusChange(a.id, '欠席')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        a.status === '欠席'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      欠席
                    </button>
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
