'use client'

import React from 'react'
import Link from 'next/link'

type ShokudoItem = {
  name: string
  location: string
  schedule: string
  target: string
  description: string
}

const SHOKUDO_LIST: ShokudoItem[] = [
  {
    name: '長崎大学前 こども食堂',
    location: '長崎市文教町（文教キャンパス周辺コミュニティスペース）',
    schedule: '毎月 第2・第4 土曜日 10:00 〜 14:00',
    target: '地域のお子様・保護者・学生',
    description: '学生ボランティアと一緒に宿題をしたり、温かい手作りごはんをみんなで食べるにぎやかな食堂です。',
  },
  {
    name: '浦上ひろば こども食堂',
    location: '長崎市岩川町（浦上駅近く）',
    schedule: '毎月 第1・第3 日曜日 11:00 〜 15:00',
    target: 'どなたでも歓迎',
    description: '地域ボランティアの方々と連携し、栄養満点のお弁当配給や食事の提供を行っています。',
  },
  {
    name: '浜町ふれあい食堂',
    location: '長崎市浜町（アーケード横）',
    schedule: '毎月 最終水曜日 16:30 〜 19:30',
    target: '小・中学生、高校生',
    description: '放課後の勉強スペースと夕食を提供。明るくアットホームな雰囲気が特徴です。',
  },
]

export default function ShokudoListPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">子ども食堂一覧</h1>
            <p className="text-[11px] text-slate-400 font-medium">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition"
        >
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">長崎市内の主な子ども食堂</h2>
            <p className="text-xs text-slate-400 font-medium">サークルメンバーがボランティアとして関わっている子ども食堂の一覧です。</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {SHOKUDO_LIST.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-sky-50/40 border border-sky-100/80 rounded-2xl shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                  <span className="px-3 py-1 bg-sky-100 text-[#0095f6] rounded-full font-bold text-[10px]">
                    {item.target}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-sky-100/60 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">開催日時</span>
                    <span className="font-bold text-slate-700">{item.schedule}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">場所</span>
                    <span className="font-bold text-slate-700">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
