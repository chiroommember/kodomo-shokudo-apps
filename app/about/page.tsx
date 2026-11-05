'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">ちるーむについて</h1>
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

      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-8">
        {/* メインビジュアル */}
        <div className="bg-gradient-to-r from-[#0095f6] to-sky-400 rounded-3xl p-8 text-white space-y-3 shadow-md">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
            初めての方へ
          </span>
          <h2 className="text-2xl font-black tracking-tight">長崎の子どもたちに、笑顔と温かい居場所を。</h2>
          <p className="text-xs text-sky-50 leading-relaxed font-medium">
            「ちるーむ」は、長崎大学の学生が中心となって地域の子ども食堂の運営サポートやボランティア活動を行っているサークルです。
          </p>
        </div>

        {/* 参加ステップ */}
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-6">
          <h3 className="text-base font-black text-slate-800">ボランティア参加までの流れ</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-2">
              <span className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
              <h4 className="text-xs font-bold text-slate-800">新規会員登録</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                トップページの「新規登録」からメールアドレスとパスワードを入力して登録します。
              </p>
            </div>

            <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-2">
              <span className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="text-xs font-bold text-slate-800">活動日時・時間を申込み</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                カレンダーから参加したい活動を選び、希望する時間帯（30分単位）とメッセージを入力して申し込みます。
              </p>
            </div>

            <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-2">
              <span className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="text-xs font-bold text-slate-800">当日会場へGO！</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                当日は指定の時間に会場へ向かい、子どもたちと一緒に料理の準備や学習支援、レクリエーションを行います。
              </p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="bg-white rounded-3xl p-8 border border-sky-100/70 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-slate-800">よくある質問</h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <p className="font-bold text-[#0095f6]">Q. 1時間だけの途中参加や早退はできますか？</p>
              <p className="text-slate-600">A. はい！申込み時に30分単位で自由に参加希望時間を選択できますので、授業の合間や空き時間でも参加可能です。</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <p className="font-bold text-[#0095f6]">Q. 料理が得意でなくても大丈夫ですか？</p>
              <p className="text-slate-600">A. もちろんです！配膳やお片付け、子どもたちと一緒に遊ぶボランティアなど、様々な役割があります。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
