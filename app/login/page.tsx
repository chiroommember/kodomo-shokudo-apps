'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`ログインしました！ (メール: ${email})`)
    // ホーム画面へ遷移
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 my-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">ログイン</h1>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          登録済みのメールアドレスとパスワードを入力してログインしてください。
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              required
              placeholder="example@nagasaki-u.ac.jp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00a6f4]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00a6f4] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm mt-4"
          >
            ログインする
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-[#00a6f4] hover:underline font-bold">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
