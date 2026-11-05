'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ADMIN_EMAILS = ['bb15125017@ms.nagasaki-u.ac.jp']

type ShokudoItem = {
  id: string
  name: string
  location: string
  schedule: string
  target: string
  description: string
}

export default function ShokudoListPage() {
  const [shokudoList, setShokudoList] = useState<ShokudoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(false)

  // モーダル用ステート
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formSchedule, setFormSchedule] = useState('')
  const [formTarget, setFormTarget] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const fetchShokudo = async () => {
    const { data, error } = await supabase
      .from('shokudo')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setShokudoList(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        if (ADMIN_EMAILS.includes(session.user.email)) {
          setCanEdit(true)
        }
      }
    })

    fetchShokudo()
  }, [])

  // 新規登録モーダルを開く
  const handleOpenNew = () => {
    setEditingId(null)
    setFormName('')
    setFormLocation('')
    setFormSchedule('')
    setFormTarget('')
    setFormDescription('')
    setIsModalOpen(true)
  }

  // 編集モーダルを開く
  const handleOpenEdit = (item: ShokudoItem) => {
    setEditingId(item.id)
    setFormName(item.name)
    setFormLocation(item.location)
    setFormSchedule(item.schedule)
    setFormTarget(item.target)
    setFormDescription(item.description)
    setIsModalOpen(true)
  }

  // 保存処理（追加・更新）
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      // 更新
      const { error } = await supabase
        .from('shokudo')
        .update({
          name: formName,
          location: formLocation,
          schedule: formSchedule,
          target: formTarget,
          description: formDescription,
        })
        .eq('id', editingId)

      if (error) alert('更新に失敗しました: ' + error.message)
      else alert('食堂情報を更新しました！')
    } else {
      // 新規作成
      const { error } = await supabase.from('shokudo').insert([
        {
          name: formName,
          location: formLocation,
          schedule: formSchedule,
          target: formTarget,
          description: formDescription,
        },
      ])

      if (error) alert('追加に失敗しました: ' + error.message)
      else alert('新しい食堂情報を追加しました！')
    }

    setIsModalOpen(false)
    fetchShokudo()
  }

  // 削除処理
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return

    const { error } = await supabase.from('shokudo').delete().eq('id', id)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      alert('削除しました')
      fetchShokudo()
    }
  }

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
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">長崎市内の主な子ども食堂</h2>
              <p className="text-xs text-slate-400 font-medium">サークルメンバーがボランティアとして関わっている子ども食堂の一覧です。</p>
            </div>
            {canEdit && (
              <button
                onClick={handleOpenNew}
                className="px-4 py-2 bg-[#0095f6] hover:bg-sky-500 text-white rounded-full text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                + 食堂を追加
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">読み込み中...</p>
          ) : shokudoList.length === 0 ? (
            <p className="text-xs text-slate-400">登録されている子ども食堂がありません。</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {shokudoList.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-sky-50/40 border border-sky-100/80 rounded-2xl shadow-2xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-sky-100 text-[#0095f6] rounded-full font-bold text-[10px]">
                        {item.target}
                      </span>
                      {canEdit && (
                        <div className="flex items-center gap-1 pl-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 transition cursor-pointer"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            削除
                          </button>
                        </div>
                      )}
                    </div>
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
          )}
        </div>
      </main>

      {/* 食堂情報 編集・追加モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">
                {editingId ? '食堂情報の編集' : '新しい食堂の追加'}
              </h3>
              <p className="text-xs text-slate-400">子ども食堂の情報を入力してください。</p>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">食堂名</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="例：長崎大学前 こども食堂"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">対象・区分</label>
                <input
                  type="text"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  placeholder="例：地域のお子様・保護者・学生"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">開催日時</label>
                <input
                  type="text"
                  value={formSchedule}
                  onChange={(e) => setFormSchedule(e.target.value)}
                  placeholder="例：毎月 第2・第4 土曜日 10:00 〜 14:00"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">場所</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="例：長崎市文教町"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">説明・特徴</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="食堂の雰囲気や特徴を入力してください"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#0095f6] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
