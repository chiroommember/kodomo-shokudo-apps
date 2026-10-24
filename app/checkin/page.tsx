'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function CheckinPage() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim() === '') return
    // 簡易チェックイン判定
    setStatus('success')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">出席管理（当日チェックイン）</h1>
          <Link href="/" className="text-xs text-sky-500 hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          当日のイベント会場に到着したら、案内されたチェックインコードまたは受付用コードを入力してください。
        </p>

        <form onSubmit={handleCheckin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              チェックインコード
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="例: 1234"
              className="w-full px-4 py-3 text-center text-lg tracking-widest font-bold border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm"
          >
            出席を記録する
          </button>
        </form>

        {status === 'success' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl text-center font-bold">
            🎉 チェックインが完了しました！ご参加ありがとうございます。
          </div>
        )}
      </div>
    </main>
  )
}
