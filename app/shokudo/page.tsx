'use client'

import React from 'react'
import Link from 'next/link'

export default function ShokudoListPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">子ども食堂一覧</h1>
          <Link href="/" className="text-xs text-sky-500 hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          サークルでサポート・連携を行っている子ども食堂の一覧です。
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <h2 className="text-sm font-bold text-slate-700">長崎大学前 こども食堂</h2>
            <p className="text-xs text-slate-500">場所: 長崎市文教町</p>
          </div>
        </div>
      </div>
    </main>
  )
}
