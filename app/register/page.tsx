'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ボランティア参加希望',
    faculty: '',
    emergencyContact: '',
    allergies: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`登録が完了しました！`)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 my-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">新規登録</h1>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          「ちるーむ」でのボランティア参加や子ども食堂の運営管理に必要な情報をご入力ください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* お名前 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              お名前（フルネーム） <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例: 長崎 太郎"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* 区分 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ご区分 <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4] bg-white font-medium"
            >
              <option value="ボランティア参加希望">ボランティア参加希望（学生・一般）</option>
              <option value="子ども食堂 運営スタッフ">子ども食堂 運営スタッフ（イベント追加・管理）</option>
            </select>
          </div>

          {/* 所属 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              所属・学校名・学年 <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <input
              type="text"
              placeholder="例: 長崎大学 教育学部 2年"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              メールアドレス（連絡先） <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="例: example@nagasaki-u.ac.jp"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* 電話番号 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              電話番号 <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="例: 090-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* 緊急連絡先 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              緊急連絡先（ご家族等） <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <input
              type="text"
              placeholder="例: 090-9999-9999（保護者）"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          {/* アレルギー */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              アレルギー・配慮事項等 <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <textarea
              rows={2}
              placeholder="例: 卵アレルギーがあります"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00a6f4] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm mt-4"
          >
            登録する
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-[#00a6f4] hover:underline font-bold">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
