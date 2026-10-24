'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('登録ありがとうございます！')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">新規登録</h1>
          <Link href="/" className="text-xs text-sky-500 hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          イベントへの参加申込やボランティア活動に必要な基本情報をご入力ください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              お名前（フルネーム）
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

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              メールアドレス（連絡先）
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

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              電話番号
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

          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm"
          >
            登録して申込へ進む
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
