# Bug Fix: Data Persistence and Form Validation

## Issues Identified:
1. **Data not persisting**: Tasks and Quran reminders are only stored in component state (useState), lost on page refresh
2. **No form validation**: Forms accept invalid input without proper validation

## Solution Overview:

### Current State:
- Data is stored only in React state (`useState`)
- No connection to the existing API endpoints
- No form validation with zod/react-hook-form

### Required Changes:

#### 1. Data Persistence Fix
The app needs to:
- **Guest Mode**: Save data to `localStorage` (survives page refresh)
- **Authenticated Mode**: Save data to database via existing API endpoints

#### 2. API Integration
API endpoints already exist at:
- `POST /api/tasks` - Create task
- `GET /api/tasks?userId=X` - Get tasks
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- Similar endpoints for `/api/quran-reminders`

#### 3. Form Validation
Use existing packages:
- `react-hook-form` (already installed)
- `zod` (already installed)
- `@hookform/resolvers` (already installed)

## Key Changes Needed in `src/app/page.tsx`:

### 1. Add imports for validation
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { taskSchema, quranReminderSchema, loginSchema } from '@/lib/validations'
```

### 2. Load data on page mount
```typescript
useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  if (isGuest) {
    // Load from localStorage
    const savedTasks = localStorage.getItem('islamic-tracker-tasks')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
  } else {
    // Load from API
    const response = await fetch(`/api/tasks?userId=${userId}`)
    const data = await response.json()
    setTasks(data)
  }
}
```

### 3. Save data when creating tasks
```typescript
const handleAddTask = async (data) => {
  if (isGuest) {
    // Save to localStorage
    const newTask = { id: Date.now().toString(), ...data }
    const updated = [newTask, ...tasks]
    setTasks(updated)
    localStorage.setItem('islamic-tracker-tasks', JSON.stringify(updated))
  } else {
    // Save to API/database
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId })
    })
    const newTask = await response.json()
    setTasks([newTask, ...tasks])
  }
}
```

### 4. Replace forms with react-hook-form
Instead of manual state management:
```typescript
// OLD WAY (current):
const [taskTitle, setTaskTitle] = useState('')
<Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />

// NEW WAY (with validation):
const taskForm = useForm({
  resolver: zodResolver(taskSchema),
  defaultValues: { title: '', category: 'general', ... }
})

<Form {...taskForm}>
  <form onSubmit={taskForm.handleSubmit(handleAddTask)}>
    <FormField
      control={taskForm.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('tasks.taskTitle')} *</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Files Created:
1. ✅ `src/lib/validations.ts` - Zod schemas for form validation
2. ⏳ `src/app/page.tsx` - Needs to be updated with above changes

## Benefits:
- ✅ Data persists across page refreshes
- ✅ Guest mode data saved in localStorage
- ✅ Authenticated users data saved to database
- ✅ Form validation prevents invalid data
- ✅ Better user experience with error messages
- ✅ Uses existing API endpoints (no backend changes needed)

## Testing Steps:
1. Create a task/reminder in guest mode
2. Refresh the page
3. Data should still be there (loaded from localStorage)
4. Try submitting forms with invalid data
5. Should see validation error messages
