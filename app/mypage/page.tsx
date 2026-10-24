'use client'

import React from 'react'
import Link from 'next/link'

export default function MyPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">マイページ・申込履歴</h1>
          <Link href="/" className="text-xs text-sky-500 hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-2">
          <p className="text-xs font-bold text-sky-900">ユーザー情報</p>
          <p className="text-xs text-slate-600">ログインしていません</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-700">あなたの申込予定・履歴</h2>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-400">
            申込履歴はまだありません
          </div>
        </div>
      </div>
    </main>
  )
}
