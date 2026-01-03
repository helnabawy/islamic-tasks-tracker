'use client'

// Islamic Tracker - Multi-language (Arabic/English), RTL/LTR support, Light/Dark mode
// Features: Task tracking, Quran reminders, Authentication, Guest mode

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, CheckCircle, Circle, Plus, Calendar, LogOut, User, Sparkles, Clock, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { taskSchema, quranReminderSchema, loginSchema, type TaskFormData, type QuranReminderFormData, type LoginFormData } from '@/lib/validations'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  category: string
  priority: string
  dueDate: Date | null
}

interface QuranReminder {
  id: string
  surahNumber: number
  surahName: string
  startAyah: number
  endAyah: number
  notes: string | null
  completed: boolean
  reminderTime: Date | null
}

const surahNamesAr = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة",
  "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر",
  "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان",
  "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
  "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر",
  "يس", "الصافات", "ص", "الزمر", "غافر",
  "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية",
  "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
  "الذاريات", "الطور", "النجم", "القمر", "الرحمن",
  "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق",
  "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
  "نوح", "الجن", "المزمل", "المدثر", "القيامة",
  "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
  "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج",
  "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
  "الشمس", "الليل", "الضحى", "الشرح", "التين",
  "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
  "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل",
  "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
  "المسد", "الإخلاص", "الفلق", "الناس"
]

const surahNamesEn = [
  "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr",
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan",
  "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir",
  "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman",
  "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq",
  "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah",
  "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj",
  "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Al-Inshirah", "At-Tin",
  "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil",
  "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
]

const translations = {
  ar: {
    common: {
      appTitle: "المتعقب الإسلامي",
      welcome: "مرحباً بك",
      welcomeDescription: "نظم مهامك اليومية وتتبع رحلة قراءة القرآن",
      guestMode: "وضع الضيف",
      loggedIn: "مسجل الدخول",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      cancel: "إلغاء",
      error: "خطأ"
    },
    tasks: {
      yourTasks: "مهامك",
      addTask: "إضافة مهمة",
      addNewTask: "إضافة مهمة جديدة",
      taskTitle: "عنوان المهمة",
      taskTitleRequired: "عنوان المهمة مطلوب",
      taskDescription: "وصف المهمة",
      taskCreated: "تم إنشاء المهمة",
      taskCreatedDesc: "تمت إضافة المهمة بنجاح",
      taskDeleted: "تم حذف المهمة",
      taskDeletedDesc: "تم حذف المهمة بنجاح",
      general: "عام",
      worship: "عبادة",
      study: "دراسة",
      work: "عمل",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      dueDate: "تاريخ الاستحقاق",
      noTasksDesc: "لا توجد مهام حالياً"
    },
    quran: {
      quranReminders: "تذكير القرآن",
      addReminder: "إضافة تذكير",
      addQuranReminder: "إضافة تذكير قرآني",
      selectSurah: "اختر السورة",
      surah: "سورة",
      ayah: "آية",
      to: "إلى",
      startAyah: "آية البداية",
      endAyah: "آية النهاية",
      notes: "ملاحظات",
      reminderTime: "وقت التذكير",
      fillRequiredFields: "يرجى ملء الحقول المطلوبة",
      reminderCreated: "تم إنشاء التذكير",
      reminderCreatedDesc: "تمت إضافة التذكير بنجاح",
      reminderDeleted: "تم حذف التذكير",
      reminderDeletedDesc: "تم حذف التذكير بنجاح",
      noRemindersDesc: "لا توجد تذكير حالياً"
    },
    auth: {
      welcomeToIslamicTracker: "مرحباً بك في المتعقب الإسلامي",
      loginDescription: "سجل الدخول للمتابعة",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginButton: "تسجيل الدخول",
      orContinueWith: "أو تابع باستخدام",
      continueAsGuest: "المتابعة كضيف",
      fillAllFields: "يرجى ملء جميع الحقول",
      loginSuccess: "تم تسجيل الدخول",
      loginSuccessDesc: "تم تسجيل الدخول بنجاح",
      loggedOut: "تم تسجيل الخروج",
      loggedOutDesc: "تم تسجيل الخروج بنجاح",
      guestModeDesc: "أنت الآن في وضع الضيف"
    },
    stats: {
      totalTasks: "إجمالي المهام",
      completed: "مكتمل",
      quranGoals: "أهداف القرآن",
      completedQuran: "مكتمل"
    },
    footer: {
      title: "المتعقب الإسلامي",
      subtitle: "نظم مهامك وتتبع قراءتك للقرآن",
      prayer: "اللهم اجعلنا من المتقين"
    }
  },
  en: {
    common: {
      appTitle: "Islamic Tracker",
      welcome: "Welcome",
      welcomeDescription: "Organize your daily tasks and track your Quran reading journey",
      guestMode: "Guest Mode",
      loggedIn: "Logged In",
      login: "Login",
      logout: "Logout",
      cancel: "Cancel",
      error: "Error"
    },
    tasks: {
      yourTasks: "Your Tasks",
      addTask: "Add Task",
      addNewTask: "Add New Task",
      taskTitle: "Task Title",
      taskTitleRequired: "Task title is required",
      taskDescription: "Task Description",
      taskCreated: "Task Created",
      taskCreatedDesc: "Task added successfully",
      taskDeleted: "Task Deleted",
      taskDeletedDesc: "Task deleted successfully",
      general: "General",
      worship: "Worship",
      study: "Study",
      work: "Work",
      low: "Low",
      medium: "Medium",
      high: "High",
      dueDate: "Due Date",
      noTasksDesc: "No tasks yet"
    },
    quran: {
      quranReminders: "Quran Reminders",
      addReminder: "Add Reminder",
      addQuranReminder: "Add Quran Reminder",
      selectSurah: "Select Surah",
      surah: "Surah",
      ayah: "Ayah",
      to: "to",
      startAyah: "Start Ayah",
      endAyah: "End Ayah",
      notes: "Notes",
      reminderTime: "Reminder Time",
      fillRequiredFields: "Please fill required fields",
      reminderCreated: "Reminder Created",
      reminderCreatedDesc: "Reminder added successfully",
      reminderDeleted: "Reminder Deleted",
      reminderDeletedDesc: "Reminder deleted successfully",
      noRemindersDesc: "No reminders yet"
    },
    auth: {
      welcomeToIslamicTracker: "Welcome to Islamic Tracker",
      loginDescription: "Sign in to continue",
      email: "Email",
      password: "Password",
      loginButton: "Login",
      orContinueWith: "Or continue with",
      continueAsGuest: "Continue as Guest",
      fillAllFields: "Please fill all fields",
      loginSuccess: "Login Successful",
      loginSuccessDesc: "Logged in successfully",
      loggedOut: "Logged Out",
      loggedOutDesc: "Logged out successfully",
      guestModeDesc: "You are now in guest mode"
    },
    stats: {
      totalTasks: "Total Tasks",
      completed: "Completed",
      quranGoals: "Quran Goals",
      completedQuran: "Completed"
    },
    footer: {
      title: "Islamic Tracker",
      subtitle: "Organize your tasks and track your Quran reading",
      prayer: "May Allah make us among the righteous"
    }
  }
}

function useTranslations() {
  const [locale, setLocale] = useState('ar')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLocale = window.localStorage.getItem('islamic-tracker-locale')
        if (savedLocale) {
          setLocale(savedLocale)
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [])
  
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[locale as keyof typeof translations]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }
  
  return { t, locale, setLocale, mounted }
}

export default function Home() {
  const { t, locale, setLocale, mounted } = useTranslations()
  const [theme, setTheme] = useState('light')
  const isRTL = locale === 'ar'
  const surahNames = isRTL ? surahNamesAr : surahNamesEn
  
  // Load theme from localStorage only on client side
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = window.localStorage.getItem('islamic-tracker-theme')
        if (savedTheme) {
          setTheme(savedTheme)
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [])
  
  const [isGuest, setIsGuest] = useState(true)
  const [userId, setUserId] = useState<string>('guest')
  const [showLogin, setShowLogin] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [quranReminders, setQuranReminders] = useState<QuranReminder[]>([])
  const [activeTab, setActiveTab] = useState('tasks')
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showQuranDialog, setShowQuranDialog] = useState(false)

  // Task form with validation
  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      dueDate: '',
    },
  })

  // Quran reminder form with validation
  const quranForm = useForm<QuranReminderFormData>({
    resolver: zodResolver(quranReminderSchema),
    defaultValues: {
      surahNumber: '',
      startAyah: '',
      endAyah: '',
      notes: '',
      reminderTime: '',
    },
  })

  // Login form with validation
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const getSurahName = (number: number) => {
    return surahNames[number - 1] || `${t('quran.surah')} ${number}`
  }

  // Load data on mount and when userId changes
  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      if (isGuest) {
        // Load from localStorage for guest mode
        const savedTasks = localStorage.getItem('islamic-tracker-tasks')
        const savedReminders = localStorage.getItem('islamic-tracker-reminders')
        
        if (savedTasks) setTasks(JSON.parse(savedTasks))
        if (savedReminders) setQuranReminders(JSON.parse(savedReminders))
      } else {
        // Load from database for authenticated users
        const [tasksRes, remindersRes] = await Promise.all([
          fetch(`/api/tasks?userId=${userId}`),
          fetch(`/api/quran-reminders?userId=${userId}`)
        ])
        
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }
        
        if (remindersRes.ok) {
          const remindersData = await remindersRes.json()
          setQuranReminders(remindersData)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to load data',
        variant: 'destructive' 
      })
    }
  }

  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const handleAddTask = async (data: TaskFormData) => {
    try {
      if (isGuest) {
        // Save to localStorage for guest mode
        const newTask: Task = {
          id: Date.now().toString(),
          title: data.title,
          description: data.description || null,
          completed: false,
          category: data.category,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : null
        }
        
        const updatedTasks = [newTask, ...tasks]
        setTasks(updatedTasks)
        saveToLocalStorage('islamic-tracker-tasks', updatedTasks)
      } else {
        // Save to database for authenticated users
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, userId })
        })
        
        if (!response.ok) throw new Error('Failed to create task')
        
        const newTask = await response.json()
        setTasks([newTask, ...tasks])
      }
      
      taskForm.reset()
      setShowTaskDialog(false)
      toast({ title: t('tasks.taskCreated'), description: t('tasks.taskCreatedDesc') })
    } catch (error) {
      console.error('Error creating task:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to create task',
        variant: 'destructive'
      })
    }
  }

  const handleToggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return
      
      const updatedTask = { ...task, completed: !task.completed }
      
      if (isGuest) {
        const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t)
        setTasks(updatedTasks)
        saveToLocalStorage('islamic-tracker-tasks', updatedTasks)
      } else {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !task.completed })
        })
        
        if (!response.ok) throw new Error('Failed to update task')
        
        const updated = await response.json()
        setTasks(tasks.map(t => t.id === id ? updated : t))
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to update task',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      if (isGuest) {
        const updatedTasks = tasks.filter(task => task.id !== id)
        setTasks(updatedTasks)
        saveToLocalStorage('islamic-tracker-tasks', updatedTasks)
      } else {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete task')
        
        setTasks(tasks.filter(task => task.id !== id))
      }
      
      toast({ title: t('tasks.taskDeleted'), description: t('tasks.taskDeletedDesc') })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to delete task',
        variant: 'destructive'
      })
    }
  }

  const handleAddQuranReminder = async (data: QuranReminderFormData) => {
    try {
      const surahNum = parseInt(data.surahNumber)
      const surahName = getSurahName(surahNum)
      
      if (isGuest) {
        const newReminder: QuranReminder = {
          id: Date.now().toString(),
          surahNumber: surahNum,
          surahName,
          startAyah: parseInt(data.startAyah),
          endAyah: parseInt(data.endAyah),
          notes: data.notes || null,
          completed: false,
          reminderTime: data.reminderTime ? new Date(data.reminderTime) : null
        }
        
        const updatedReminders = [newReminder, ...quranReminders]
        setQuranReminders(updatedReminders)
        saveToLocalStorage('islamic-tracker-reminders', updatedReminders)
      } else {
        const response = await fetch('/api/quran-reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surahNumber: surahNum,
            surahName,
            startAyah: parseInt(data.startAyah),
            endAyah: parseInt(data.endAyah),
            notes: data.notes,
            reminderTime: data.reminderTime,
            userId
          })
        })
        
        if (!response.ok) throw new Error('Failed to create reminder')
        
        const newReminder = await response.json()
        setQuranReminders([newReminder, ...quranReminders])
      }
      
      quranForm.reset()
      setShowQuranDialog(false)
      toast({ title: t('quran.reminderCreated'), description: t('quran.reminderCreatedDesc') })
    } catch (error) {
      console.error('Error creating reminder:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to create reminder',
        variant: 'destructive'
      })
    }
  }

  const handleToggleQuranReminder = async (id: string) => {
    try {
      const reminder = quranReminders.find(r => r.id === id)
      if (!reminder) return
      
      const updatedReminder = { ...reminder, completed: !reminder.completed }
      
      if (isGuest) {
        const updatedReminders = quranReminders.map(r => r.id === id ? updatedReminder : r)
        setQuranReminders(updatedReminders)
        saveToLocalStorage('islamic-tracker-reminders', updatedReminders)
      } else {
        const response = await fetch(`/api/quran-reminders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !reminder.completed })
        })
        
        if (!response.ok) throw new Error('Failed to update reminder')
        
        const updated = await response.json()
        setQuranReminders(quranReminders.map(r => r.id === id ? updated : r))
      }
    } catch (error) {
      console.error('Error toggling reminder:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to update reminder',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteQuranReminder = async (id: string) => {
    try {
      if (isGuest) {
        const updatedReminders = quranReminders.filter(r => r.id !== id)
        setQuranReminders(updatedReminders)
        saveToLocalStorage('islamic-tracker-reminders', updatedReminders)
      } else {
        const response = await fetch(`/api/quran-reminders/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete reminder')
        
        setQuranReminders(quranReminders.filter(r => r.id !== id))
      }
      
      toast({ title: t('quran.reminderDeleted'), description: t('quran.reminderDeletedDesc') })
    } catch (error) {
      console.error('Error deleting reminder:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Failed to delete reminder',
        variant: 'destructive'
      })
    }
  }

  const handleLogin = async (data: LoginFormData) => {
    try {
      // For demo purposes, simulate login
      setIsGuest(false)
      setUserId('demo-user-id')
      setShowLogin(false)
      loginForm.reset()
      toast({ title: t('auth.loginSuccess'), description: t('auth.loginSuccessDesc') })
    } catch (error) {
      console.error('Error during login:', error)
      toast({ 
        title: t('common.error'), 
        description: 'Login failed',
        variant: 'destructive'
      })
    }
  }

  const handleGuestMode = () => {
    setIsGuest(true)
    setUserId('guest')
    setShowLogin(false)
    toast({ title: t('auth.guestModeDesc'), description: t('auth.guestModeDesc') })
  }

  const handleLogout = () => {
    setIsGuest(true)
    setUserId('guest')
    setTasks([])
    setQuranReminders([])
    toast({ title: t('auth.loggedOut'), description: t('auth.loggedOutDesc') })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      worship: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      study: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      work: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    }
    return colors[category] || colors.general
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[priority] || colors.medium
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const completedQuran = quranReminders.filter(r => r.completed).length
  
  // Use theme for background image - default to light pattern until mounted
  const bgImage = mounted && theme === 'dark'
    ? '/backgrounds/islamic-pattern-dark.png'
    : '/backgrounds/islamic-pattern-1.png'
  
  return (
    <div className="min-h-screen relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Animated Islamic Pattern Background */}
      <div
        className="fixed inset-0 z-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-emerald-50/90 via-white/95 to-teal-50/90 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-emerald-950/95" />

      {/* Decorative Islamic Geometric Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 z-0" />

      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background w-full max-w-md rounded-2xl shadow-2xl p-6 relative z-10"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto flex items-center justify-center mb-4"
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold">{t('auth.welcomeToIslamicTracker')}</h2>
                <p className="text-muted-foreground mt-2">{t('auth.loginDescription')}</p>
              </div>

              <div className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t('auth.email')}
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('auth.password')}
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      {t('auth.loginButton')}
                    </Button>
                  </form>
                </Form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">{t('auth.orContinueWith')}</span>
                  </div>
                </div>
                <Button
                  onClick={handleGuestMode}
                  variant="outline"
                  className="w-full h-12"
                >
                  {t('auth.continueAsGuest')}
                </Button>
              </div>

              <Button
                onClick={() => setShowLogin(false)}
                variant="ghost"
                className="w-full mt-4"
              >
                {t('common.cancel')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-40"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {t('common.appTitle')}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {isGuest ? t('common.guestMode') : t('common.loggedIn')}
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
                {isGuest ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowLogin(true)}
                      variant="default"
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('common.login')}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => {
                        setIsGuest(true)
                        toast({ title: t('auth.loggedOut'), description: t('auth.loggedOutDesc') })
                      }}
                      variant="outline"
                    >
                      <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('common.logout')}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white overflow-hidden relative">
                {/* Animated Background Pattern */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 1, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'url(/backgrounds/islamic-pattern-2.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    {t('common.welcome')}
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    {t('common.welcomeDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 text-center"
                    >
                      <div className="text-3xl font-bold">{tasks.length}</div>
                      <div className="text-sm text-white/90">{t('stats.totalTasks')}</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 text-center"
                    >
                      <div className="text-3xl font-bold">{completedTasks}</div>
                      <div className="text-sm text-white/90">{t('stats.completed')}</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 text-center"
                    >
                      <div className="text-3xl font-bold">{quranReminders.length}</div>
                      <div className="text-sm text-white/90">{t('stats.quranGoals')}</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 text-center"
                    >
                      <div className="text-3xl font-bold">{completedQuran}</div>
                      <div className="text-sm text-white/90">{t('stats.completedQuran')}</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background h-12">
                <TabsTrigger value="tasks" className="h-10">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('tasks.yourTasks')}
                </TabsTrigger>
                <TabsTrigger value="quran" className="h-10">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('quran.quranReminders')}
                </TabsTrigger>
              </TabsList>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{t('tasks.yourTasks')}</h2>
                    <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('tasks.addTask')}
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{t('tasks.addNewTask')}</DialogTitle>
                          <DialogDescription>{t('tasks.addNewTask')}</DialogDescription>
                        </DialogHeader>
                        <Form {...taskForm}>
                          <form onSubmit={taskForm.handleSubmit(handleAddTask)} className="space-y-4 mt-4">
                            <FormField
                              control={taskForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('tasks.taskTitle')} *</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t('tasks.taskTitle')} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={taskForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('tasks.taskDescription')}</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder={t('tasks.taskDescription')} {...field} rows={3} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={taskForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('tasks.category')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="general">{t('tasks.general')}</SelectItem>
                                        <SelectItem value="worship">{t('tasks.worship')}</SelectItem>
                                        <SelectItem value="study">{t('tasks.study')}</SelectItem>
                                        <SelectItem value="work">{t('tasks.work')}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={taskForm.control}
                                name="priority"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('tasks.priority')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="low">{t('tasks.low')}</SelectItem>
                                        <SelectItem value="medium">{t('tasks.medium')}</SelectItem>
                                        <SelectItem value="high">{t('tasks.high')}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={taskForm.control}
                              name="dueDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('tasks.dueDate')}</FormLabel>
                                  <FormControl>
                                    <Input type="datetime-local" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                              {t('tasks.addTask')}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {tasks.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <Circle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                          <p>{t('tasks.noTasksDesc')}</p>
                        </motion.div>
                      ) : (
                        tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.02, x: isRTL ? -5 : 5 }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              task.completed
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleToggleTask(task.id)}
                                className="mt-1"
                              >
                                {task.completed ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </motion.button>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className={`text-sm mt-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <Badge className={getCategoryColor(task.category)}>
                                    {t(`tasks.${task.category}`)}
                                  </Badge>
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {t(`tasks.${task.priority}`)}
                                  </Badge>
                                  {task.dueDate && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              </TabsContent>

              {/* Quran Reminders Tab */}
              <TabsContent value="quran" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{t('quran.quranReminders')}</h2>
                    <Dialog open={showQuranDialog} onOpenChange={setShowQuranDialog}>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('quran.addReminder')}
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{t('quran.addQuranReminder')}</DialogTitle>
                          <DialogDescription>{t('quran.addQuranReminder')}</DialogDescription>
                        </DialogHeader>
                        <Form {...quranForm}>
                          <form onSubmit={quranForm.handleSubmit(handleAddQuranReminder)} className="space-y-4 mt-4">
                            <FormField
                              control={quranForm.control}
                              name="surahNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('quran.selectSurah')} *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('quran.selectSurah')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[300px]">
                                        {surahNames.map((name, index) => (
                                          <SelectItem key={index + 1} value={(index + 1).toString()}>
                                            {index + 1}. {name}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={quranForm.control}
                                name="startAyah"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('quran.startAyah')} *</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="1" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={quranForm.control}
                                name="endAyah"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('quran.endAyah')} *</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="10" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={quranForm.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('quran.notes')}</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder={t('quran.notes')} {...field} rows={3} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={quranForm.control}
                              name="reminderTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('quran.reminderTime')}</FormLabel>
                                  <FormControl>
                                    <Input type="datetime-local" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                              {t('quran.addReminder')}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {quranReminders.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                          <p>{t('quran.noRemindersDesc')}</p>
                        </motion.div>
                      ) : (
                        quranReminders.map((reminder) => (
                          <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.02, x: isRTL ? -5 : 5 }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              reminder.completed
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleToggleQuranReminder(reminder.id)}
                                className="mt-1"
                              >
                                {reminder.completed ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </motion.button>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-lg ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {reminder.surahName}
                                </h3>
                                <p className={`text-sm ${reminder.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                  {t('quran.surah')} {reminder.surahNumber}, {t('quran.ayah')} {reminder.startAyah} {t('quran.to')} {reminder.endAyah}
                                </p>
                                {reminder.notes && (
                                  <p className={`text-sm mt-2 ${reminder.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                    {reminder.notes}
                                  </p>
                                )}
                                {reminder.reminderTime && (
                                  <Badge variant="outline" className="flex items-center gap-1 mt-3">
                                    <Clock className="w-3 h-3" />
                                    {new Date(reminder.reminderTime).toLocaleString()}
                                  </Badge>
                                )}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteQuranReminder(reminder.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/80 backdrop-blur-lg mt-auto relative z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">{t('footer.title')} - {t('footer.subtitle')}</p>
              <p>{t('footer.prayer')}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
