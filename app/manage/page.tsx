'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ADMIN_EMAILS = [
  'bb15125017@ms.nagasaki-u.ac.jp',
]

type ShokudoItem = {
  id: string
  no: number
  name: string
  district: string
  address: string
  contact_person: string
  phone: string
  email: string
  sns: string
  frequency: string
  contact_method: string
  notes: string
}

type ActivityCheckItem = {
  id: string
  activity_date: string
  shokudo_name: string
  time_range: string
  members_count: string
  day_before_check: string
  photo_check: string
  permission_check: string
  instagram_post: string
  notes: string
}

export default function ManagePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'shokudo' | 'checks'>('shokudo')
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  const [shokudoList, setShokudoList] = useState<ShokudoItem[]>([])
  const [activityChecks, setActivityChecks] = useState<ActivityCheckItem[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || !session.user.email) {
        alert('ログインが必要です。')
        router.push('/')
        return
      }

      const email = session.user.email
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single()

      const role = prof?.role

      if (ADMIN_EMAILS.includes(email) || role === 'admin' || role === 'staff') {
        setAuthorized(true)
        fetchData()
      } else {
        alert('このページにアクセスする権限がありません。')
        router.push('/')
      }
      setLoading(false)
    })
  }, [router])

  const fetchData = async () => {
    const { data: sData } = await supabase.from('shokudo_list').select('*').order('no', { ascending: true })
    if (sData) setShokudoList(sData)

    const { data: cData } = await supabase.from('activity_checks').select('*').order('activity_date', { ascending: false })
    if (cData) setActivityChecks(cData)
  }

  // チェック状態を切り替える関数（タップで 済 ⇄ 未 ⇄ 不要 など）
  const handleToggleCheck = async (id: string, field: keyof ActivityCheckItem, currentValue: string) => {
    const nextVal = currentValue === '済' ? '未' : currentValue === '未' ? '不要' : '済'
    const { error } = await supabase
      .from('activity_checks')
      .update({ [field]: nextVal })
      .eq('id', id)

    if (error) {
      alert('更新に失敗しました: ' + error.message)
    } else {
      fetchData()
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400">読み込み中...</div>
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-[#0095f6] text-white rounded-2xl flex items-center justify-center font-bold text-base shadow-sm">ち</div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">サークル員専用管理画面</h1>
            <p className="text-[10px] text-slate-400">長崎大学 こども食堂サポートサークル</p>
          </div>
        </div>
        <Link href="/" className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* タブ切り替え */}
        <div className="flex space-x-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('shokudo')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer ${
              activeTab === 'shokudo' ? 'bg-[#0095f6] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            子ども食堂 連絡先・コツ一覧
          </button>
          <button
            onClick={() => setActiveTab('checks')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer ${
              activeTab === 'checks' ? 'bg-[#0095f6] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            活動日チェックリスト
          </button>
        </div>

        {/* ① 子ども食堂リストタブ */}
        {activeTab === 'shokudo' && (
          <div className="space-y-4">
            <div className="bg-[#f0f7ff] border border-sky-100 rounded-3xl p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-black text-[#0095f6]">💡 連絡時の注意・コツ</h3>
              <p className="text-[11px] text-slate-500 mt-1">「○曜のみ対応」「DMは既読が遅い」など、連絡して分かったコツをサークル員で共有できます。</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {shokudoList.map((item) => (
                <div key={item.id} className="bg-white border border-sky-100 rounded-2xl p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0095f6]">No.{item.no} {item.name}</span>
                    <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded-full">{item.district}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div><span className="font-bold text-slate-400">住所:</span> {item.address}</div>
                    <div><span className="font-bold text-slate-400">担当者:</span> {item.contact_person} ({item.phone})</div>
                    <div><span className="font-bold text-slate-400">連絡手段:</span> {item.contact_method}</div>
                    <div><span className="font-bold text-slate-400">頻度:</span> {item.frequency}</div>
                  </div>
                  {item.notes && (
                    <div className="text-[11px] bg-amber-50/60 border border-amber-200/50 p-2.5 rounded-xl text-amber-800 font-medium">
                      <span className="font-bold">コツ・備考:</span> {item.notes}
                    </div>
                  )}
                </div>
              ))}
              {shokudoList.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                  子ども食堂データがまだ登録されていません。（エクセルからインポート可能です）
                </div>
              )}
            </div>
          </div>
        )}

        {/* ② 活動日チェックリストタブ */}
        {activeTab === 'checks' && (
          <div className="space-y-4">
            <div className="bg-[#f0f7ff] border border-sky-100 rounded-3xl p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-black text-[#0095f6]">📋 活動チェックリスト（タップで切り替え）</h3>
              <p className="text-[11px] text-slate-500 mt-1">「未」をタップすると「済」に、もう一度タップすると「不要」に切り替わります。</p>
            </div>

            <div className="space-y-3">
              {activityChecks.map((check) => (
                <div key={check.id} className="bg-white border border-sky-100 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-sky-50 pb-2">
                    <div>
                      <span className="text-xs font-black text-slate-800">{check.activity_date}</span>
                      <span className="text-xs font-bold text-[#0095f6] ml-2">{check.shokudo_name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{check.time_range} / 参加:{check.members_count}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between space-y-1">
                      <span className="text-slate-400 font-bold">前日確認</span>
                      <button
                        onClick={() => handleToggleCheck(check.id, 'day_before_check', check.day_before_check)}
                        className={`py-1 rounded-lg font-bold transition cursor-pointer ${
                          check.day_before_check === '済' ? 'bg-emerald-500 text-white' : check.day_before_check === '不要' ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {check.day_before_check}
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between space-y-1">
                      <span className="text-slate-400 font-bold">写真撮影</span>
                      <button
                        onClick={() => handleToggleCheck(check.id, 'photo_check', check.photo_check)}
                        className={`py-1 rounded-lg font-bold transition cursor-pointer ${
                          check.photo_check === '済' ? 'bg-emerald-500 text-white' : check.photo_check === '不要' ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {check.photo_check}
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between space-y-1">
                      <span className="text-slate-400 font-bold">掲載許可確認</span>
                      <button
                        onClick={() => handleToggleCheck(check.id, 'permission_check', check.permission_check)}
                        className={`py-1 rounded-lg font-bold transition cursor-pointer ${
                          check.permission_check === '済' ? 'bg-emerald-500 text-white' : check.permission_check === '不要' ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {check.permission_check}
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between space-y-1">
                      <span className="text-slate-400 font-bold">Insta投稿</span>
                      <button
                        onClick={() => handleToggleCheck(check.id, 'instagram_post', check.instagram_post)}
                        className={`py-1 rounded-lg font-bold transition cursor-pointer ${
                          check.instagram_post === '済' ? 'bg-emerald-500 text-white' : check.instagram_post === '不要' ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {check.instagram_post}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {activityChecks.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                  活動日のチェック項目がまだ登録されていません。
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
