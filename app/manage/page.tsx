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
}

type MonthlyTaskItem = {
  id: string
  title: string
  assignee: string
  due_date: string
  status: string
}

type RegistrationWithEvent = {
  id: string
  user_email: string
  participation_time?: string
  message?: string
  events: {
    title: string
    event_date: string
    location: string
  } | null
}

type ProfileItem = {
  email: string
  name: string
}

export default function ManagePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'shokudo' | 'checks' | 'tasks' | 'reports'>('shokudo')
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  const [shokudoList, setShokudoList] = useState<ShokudoItem[]>([])
  const [activityChecks, setActivityChecks] = useState<ActivityCheckItem[]>([])
  const [monthlyTasks, setMonthlyTasks] = useState<MonthlyTaskItem[]>([])
  const [registrationsList, setRegistrationsList] = useState<RegistrationWithEvent[]>([])
  const [profilesMap, setProfilesMap] = useState<{ [email: string]: string }>({})

  // 子ども食堂の追加・編集モーダル用 state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShokudo, setEditingShokudo] = useState<ShokudoItem | null>(null)
  const [formData, setFormData] = useState({
    no: 1,
    name: '',
    district: '',
    address: '',
    contact_person: '',
    phone: '',
    email: '',
    sns: '',
    frequency: '',
    contact_method: '',
  })

  // 月次タスク追加モーダル用 state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    assignee: '',
    due_date: '',
    status: '未着手',
  })

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

    const { data: tData } = await supabase.from('monthly_tasks').select('*').order('created_at', { ascending: true })
    if (tData) setMonthlyTasks(tData)

    // プロフィール一覧を取得して、メールアドレス -> 名前の対応マップを作る
    const { data: pData } = await supabase.from('profiles').select('email, name')
    if (pData) {
      const map: { [email: string]: string } = {}
      pData.forEach((p: ProfileItem) => {
        if (p.email && p.name) {
          map[p.email] = p.name
        }
      })
      setProfilesMap(map)
    }

    // 申込データとイベント情報を結合して取得
    const { data: rData } = await supabase
      .from('registrations')
      .select(`
        id,
        user_email,
        participation_time,
        message,
        events (
          title,
          event_date,
          location
        )
      `)
    if (rData) {
      setRegistrationsList(rData as unknown as RegistrationWithEvent[])
    }
  }

  // チェック状態切り替え（活動日チェック）
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

  // 月次タスクのステータス切り替え（未着手 ⇄ 進行中 ⇄ 完了）
  const handleToggleTaskStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === '未着手' ? '進行中' : currentStatus === '進行中' ? '完了' : '未着手'
    const { error } = await supabase
      .from('monthly_tasks')
      .update({ status: nextStatus })
      .eq('id', id)

    if (error) {
      alert('ステータスの更新に失敗しました: ' + error.message)
    } else {
      fetchData()
    }
  }

  // 子ども食堂モーダルを開く
  const handleOpenModal = (item?: ShokudoItem) => {
    if (item) {
      setEditingShokudo(item)
      setFormData({
        no: item.no || 1,
        name: item.name || '',
        district: item.district || '',
        address: item.address || '',
        contact_person: item.contact_person || '',
        phone: item.phone || '',
        email: item.email || '',
        sns: item.sns || '',
        frequency: item.frequency || '',
        contact_method: item.contact_method || '',
      })
    } else {
      setEditingShokudo(null)
      setFormData({
        no: shokudoList.length + 1,
        name: '',
        district: '',
        address: '',
        contact_person: '',
        phone: '',
        email: '',
        sns: '',
        frequency: '',
        contact_method: '',
      })
    }
    setIsModalOpen(true)
  }

  // 子ども食堂の保存
  const handleSaveShokudo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingShokudo) {
      const { error } = await supabase
        .from('shokudo_list')
        .update(formData)
        .eq('id', editingShokudo.id)

      if (error) {
        alert('更新に失敗しました: ' + error.message)
      } else {
        alert('子ども食堂情報を更新しました！')
        setIsModalOpen(false)
        fetchData()
      }
    } else {
      const { error } = await supabase
        .from('shokudo_list')
        .insert([formData])

      if (error) {
        alert('追加に失敗しました: ' + error.message)
      } else {
        alert('子ども食堂を追加しました！')
        setIsModalOpen(false)
        fetchData()
      }
    }
  }

  // 子ども食堂削除
  const handleDeleteShokudo = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return

    const { error } = await supabase.from('shokudo_list').delete().eq('id', id)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      alert('削除しました')
      fetchData()
    }
  }

  // 月次タスク追加
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('monthly_tasks').insert([taskFormData])

    if (error) {
      alert('タスクの追加に失敗しました: ' + error.message)
    } else {
      alert('月次タスクを追加しました！')
      setIsTaskModalOpen(false)
      setTaskFormData({ title: '', assignee: '', due_date: '', status: '未着手' })
      fetchData()
    }
  }

  // 月次タスク削除
  const handleDeleteTask = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) return
    const { error } = await supabase.from('monthly_tasks').delete().eq('id', id)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
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
        <div className="flex items-center gap-2">
          <Link href="/admin" className="px-3.5 py-1.5 text-xs font-bold text-[#0095f6] bg-sky-50 hover:bg-sky-100 rounded-full transition">
            管理ポータルへ
          </Link>
          <Link href="/" className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* タブ切り替え */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('shokudo')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'shokudo' ? 'bg-[#0095f6] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              子ども食堂 一覧
            </button>
            <button
              onClick={() => setActiveTab('checks')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'checks' ? 'bg-[#0095f6] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              活動日チェックリスト
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'tasks' ? 'bg-[#0095f6] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              月次タスク管理
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'reports' ? 'bg-[#0095f6] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              参加者一覧・活動実績
            </button>
          </div>

          {activeTab === 'shokudo' && (
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer whitespace-nowrap"
            >
              ＋ 子ども食堂を追加
            </button>
          )}

          {activeTab === 'tasks' && (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer whitespace-nowrap"
            >
              ＋ 月次タスクを追加
            </button>
          )}
        </div>

        {/* ① 子ども食堂リストタブ */}
        {activeTab === 'shokudo' && (
          <div className="space-y-3">
            {shokudoList.map((item) => (
              <div key={item.id} className="bg-white border border-sky-100 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0095f6]">No.{item.no} {item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2.5 py-0.5 rounded-full">{item.district}</span>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteShokudo(item.id, item.name)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                    >
                      削除
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div><span className="font-bold text-slate-400">住所:</span> {item.address || '（未登録）'}</div>
                  <div><span className="font-bold text-slate-400">担当者:</span> {item.contact_person || '（未登録）'} ({item.phone || 'ー'})</div>
                  <div><span className="font-bold text-slate-400">連絡手段:</span> {item.contact_method || 'ー'}</div>
                  <div><span className="font-bold text-slate-400">頻度:</span> {item.frequency || 'ー'}</div>
                </div>
              </div>
            ))}
            {shokudoList.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                子ども食堂データが登録されていません。
              </div>
            )}
          </div>
        )}

        {/* ② 活動日チェックリストタブ */}
        {activeTab === 'checks' && (
          <div className="space-y-3">
            {activityChecks.map((check) => (
              <div key={check.id} className="bg-white border border-sky-100 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-sky-50 pb-2">
                  <div>
                    <span className="text-xs font-black text-slate-800">{check.activity_date}</span>
                    <span className="text-xs font-bold text-[#0095f6] ml-2">{check.shokudo_name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{check.time_range} / 参加:{check.members_count}人</span>
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
          </div>
        )}

        {/* ③ 月次タスク管理タブ */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {monthlyTasks.map((task) => (
              <div key={task.id} className="bg-white border border-sky-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-800">{task.title}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">期限: {task.due_date || '未設定'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">担当者: <span className="font-bold text-slate-700">{task.assignee || '未割当'}</span></p>
                </div>

                <div className="flex items-center gap-2.5 justify-end">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      task.status === '完了' ? 'bg-emerald-500 text-white shadow-xs' : task.status === '進行中' ? 'bg-amber-400 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {task.status}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id, task.title)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition cursor-pointer"
                    title="削除"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {monthlyTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                月次タスクが登録されていません。右上のボタンから追加してください。
              </div>
            )}
          </div>
        )}

        {/* ④ 参加者一覧・活動実績タブ */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="bg-[#f0f7ff] border border-sky-100 rounded-3xl p-5 space-y-1">
              <h3 className="text-xs sm:text-sm font-black text-[#0095f6]">📋 ボランティア参加者一覧</h3>
              <p className="text-[11px] text-slate-500">
                「誰が・いつ・どの活動に・何時〜何時に参加したか」の申込データがリアルタイムで一覧表示されます。
              </p>
            </div>

            <div className="bg-white border border-sky-100 rounded-3xl p-4 shadow-2xs overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-sky-50/50 text-slate-500 border-b border-sky-100">
                  <tr>
                    <th className="p-3 font-bold">参加者名</th>
                    <th className="p-3 font-bold">イベント名</th>
                    <th className="p-3 font-bold">開催日</th>
                    <th className="p-3 font-bold">参加希望時間</th>
                    <th className="p-3 font-bold">ひとこと</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrationsList.map((item) => {
                    const userName = profilesMap[item.user_email] || item.user_email
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-[#0095f6]">{userName}</td>
                        <td className="p-3 font-bold">{item.events?.title || 'ー'}</td>
                        <td className="p-3 text-slate-500">{item.events?.event_date || 'ー'}</td>
                        <td className="p-3 text-slate-600">{item.participation_time || 'ー'}</td>
                        <td className="p-3 text-slate-400 truncate max-w-[200px]">{item.message || 'ー'}</td>
                      </tr>
                    )
                  })}
                  {registrationsList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        現在蓄積されている参加データはありません。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 子ども食堂の追加・編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-800">
              {editingShokudo ? '子ども食堂情報を編集' : '新しい子ども食堂を追加'}
            </h3>

            <form onSubmit={handleSaveShokudo} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">No.（番号）</label>
                  <input
                    type="number"
                    value={formData.no}
                    onChange={(e) => setFormData({ ...formData, no: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600">地区</label>
                  <input
                    type="text"
                    placeholder="例：西山"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600">名称</label>
                <input
                  type="text"
                  placeholder="例：冒険者ギルド 長崎の夜明け"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600">住所</label>
                <input
                  type="text"
                  placeholder="例：長崎市西山3-31-16"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">担当者名</label>
                  <input
                    type="text"
                    placeholder="例：浦川 龍徳"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600">電話番号</label>
                  <input
                    type="text"
                    placeholder="例：080-3221-1230"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">連絡手段</label>
                  <input
                    type="text"
                    placeholder="例：LINEグループ"
                    value={formData.contact_method}
                    onChange={(e) => setFormData({ ...formData, contact_method: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600">活動頻度</label>
                  <input
                    type="text"
                    placeholder="例：月一・日曜日"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  やめる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 月次タスク追加モーダル */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-800">新しい月次タスクを追加</h3>

            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600">タスク名</label>
                <input
                  type="text"
                  placeholder="例：やってみゅーでスク月次活動報告"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">担当者名</label>
                  <input
                    type="text"
                    placeholder="例：長崎 太郎"
                    value={taskFormData.assignee}
                    onChange={(e) => setTaskFormData({ ...taskFormData, assignee: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600">期限</label>
                  <input
                    type="text"
                    placeholder="例：毎月末日"
                    value={taskFormData.due_date}
                    onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  やめる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0095f6] hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
