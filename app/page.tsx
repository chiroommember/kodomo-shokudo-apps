'client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-sky-100 space-y-6">
        <div className="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto shadow-sm shadow-sky-200">
          ち
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-sky-950">ちるーむへようこそ</h1>
          <p className="text-xs text-slate-500">
            長崎大学 こども食堂サポートサークル
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="block w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition shadow-sm"
          >
            ログイン・新規登録へ
          </Link>
        </div>
      </div>
    </main>
  )
}
