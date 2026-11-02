'app/client'
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントの初期化（環境変数を使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Supabaseの機能を使ってメールリンク（マジックリンク）を送信
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (error) {
        alert('エラーが発生しました: ' + error.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      alert('予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 my-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">メールでログイン</h1>
          <Link href="/" className="text-xs text-[#00a6f4] font-bold hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        {!sent ? (
          <>
            <p className="text-xs text-slate-500 leading-relaxed">
              ご登録のメールアドレスを入力してください。ログイン用の確認メールをお送りします。
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#00a6f4] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm mt-4 disabled:opacity-50"
              >
                {loading ? '送信中...' : 'ログイン用メールを送信'}
              </button>
            </form>
          </>
        ) : (
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-center space-y-3">
            <p className="text-xs font-bold text-sky-900">✨ メールの送信が完了しました！</p>
            <p className="text-xs text-slate-600">
              <span className="font-bold">{email}</span> 宛にログイン用のリンクを記載したメールをお送りしました。メール内のリンクをクリックしてログインを完了してください。
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-[#00a6f4] font-bold hover:underline pt-2 block mx-auto"
            >
              もう一度メールを送る
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
