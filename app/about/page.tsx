'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
            ち
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">ちるーむ</h1>
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

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-6 pt-8 space-y-8">
        {/* タイトルセクション */}
        <div className="bg-[#f0f7ff] border border-sky-100/70 rounded-3xl p-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0095f6] bg-white px-3.5 py-1 rounded-full border border-sky-100 shadow-2xs">
            <span>初めての方へ</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            ちるーむの活動と使い方のご案内
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            長崎大学のこども食堂サポートサークル「ちるーむ」へようこそ！
            当サービスは、子ども食堂の活動予定確認やボランティア参加申込をスムーズに行うためのシステムです。
          </p>
        </div>

        {/* セクション1: ちるーむとは */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#008ce6]">
            ちるーむについて
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            長崎市内を中心に開催される子ども食堂と、ボランティアとして参加したい学生や地域の方々をつなぐプラットフォームです。
            温かい食事の提供や、子どもたちの学習・遊びのサポートを通じて、地域社会に貢献することを目指しています。
          </p>
        </div>

        {/* セクション2: 参加の流れ */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-[#008ce6]">
            ボランティア参加の流れ
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">アカウント登録・ログイン</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  トップページの「新規登録」または「ログイン」から、メールアドレス（マジックリンク）を使用してログインを行います。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">活動予定カレンダーで日程を確認</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  トップページのカレンダーから、開催予定の食堂や日時を確認します。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">参加申込を行う</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  参加したい日程を選んで申し込むと、マイページに申込履歴が保存されます。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-7 h-7 bg-[#0095f6] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">当日チェックイン</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  当日は会場にて「出席管理（当日用）」ページからチェックインを行って活動に参加します。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* セクション3: 注意事項 */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100/70 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-[#008ce6]">
            ご利用上の注意
          </h3>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li>参加をキャンセルされる場合は、早めにマイページ等からお手続きをお願いします。</li>
            <li>ご不明な点やご質問がある場合は、サークル関係者までお気軽にお問い合わせください。</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
