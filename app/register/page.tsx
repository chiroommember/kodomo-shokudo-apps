'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '長崎大学生',
    faculty: '',
    emergencyContact: '',
    allergies: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('登録ありがとうございます！登録が完了しました。')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 my-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">新規登録</h1>
          <Link href="/" className="text-xs text-sky-500 hover:underline font-bold">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          「ちるーむ」でのボランティア参加やイベント申込に必要な情報をご入力ください。
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
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* 区分・立場 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ご区分・立場 <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="長崎大学生">長崎大学生（サークル員・スタッフ）</option>
              <option value="他大学生">他大学生ボランティア</option>
              <option value="一般ボランティア">一般ボランティア</option>
              <option value="保護者・参加者">保護者・一般参加者</option>
            </select>
          </div>

          {/* 学部・学年（任意） */}
          {formData.role.includes('学生') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                学部・学科・学年 <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <input
                type="text"
                placeholder="例: 教育学部 2年"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          )}

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
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
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
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* 緊急連絡先 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              緊急連絡先（ご家族等） <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <input
              type="text"
              placeholder="例: 090-9999-9999（父）"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* アレルギー等 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              アレルギー・配慮事項等 <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <textarea
              rows={2}
              placeholder="例: 卵アレルギーがあります / 車いすを利用しています"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm mt-4"
          >
            登録して次へ進む
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-sky-500 hover:underline font-bold">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
