'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function MyPage() {
  const [formData, setFormData] = useState({
    name: '長崎 太郎',
    email: 'taro@example.com',
    phone: '090-1234-5678',
    role: 'ボランティア参加希望',
    faculty: '長崎大学 教育学部 2年',
    emergencyContact: '090-9999-9999',
    allergies: 'なし',
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    alert('プロフィール設定を更新しました！')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8 my-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">マイページ・アカウント設定</h1>
            <p className="text-xs text-slate-400 mt-0.5">登録情報の確認・変更および参加予定イベントの管理</p>
          </div>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        {/* プロフィール・設定セクション */}
        <div className="bg-sky-50/60 rounded-2xl p-6 border border-sky-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-sky-900 uppercase tracking-wider">登録プロフィール設定</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-[#00a6f4] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-sky-600 transition"
              >
                編集する
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition"
              >
                キャンセル
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <p className="text-slate-400 font-bold">お名前</p>
                <p className="font-bold text-slate-800">{formData.name}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <p className="text-slate-400 font-bold">ご区分</p>
                <p className="font-bold text-sky-600">{formData.role}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <p className="text-slate-400 font-bold">メールアドレス</p>
                <p className="font-bold text-slate-800">{formData.email}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <p className="text-slate-400 font-bold">電話番号</p>
                <p className="font-bold text-slate-800">{formData.phone}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <p className="text-slate-400 font-bold">所属・学校名・学年</p>
                <p className="font-bold text-slate-800">{formData.faculty}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                <p className="text-slate-400 font-bold">緊急連絡先・アレルギー等</p>
                <p className="font-bold text-slate-800">{formData.emergencyContact} / {formData.allergies}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">お名前</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">電話番号</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">所属・学校名・学年</label>
                <input
                  type="text"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#00a6f4] text-white font-bold rounded-xl text-xs shadow-sm hover:bg-sky-600 transition"
              >
                変更を保存する
              </button>
            </form>
          )}
        </div>

        {/* 参加予定イベント一覧 */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-700">📅 自分の参加予定イベント履歴</h2>
          <div className="space-y-2">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between text-xs shadow-sm">
              <div>
                <p className="font-bold text-slate-800">長崎大学前 こども食堂</p>
                <p className="text-[10px] text-slate-400 mt-0.5">2026年10月10日（土） 17:00〜</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                申込済み
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
