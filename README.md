# Islamic Tracker

A modern, beautiful task tracking and Quran reading reminder application built with Next.js 15, TypeScript, and shadcn/ui.

## Features

### 🎯 Task Tracking
- Create, complete, and delete tasks
- Organize tasks by category (General, Worship, Study, Work)
- Set priority levels (Low, Medium, High)
- Add due dates for time-sensitive tasks
- Visual indicators for task status

### 📖 Quran Reading Reminders
- Track Quran reading goals by Surah and Ayah
- Set reminders for specific reading times
- Add notes and reflections
- Mark reading sessions as complete

### 👤 Authentication & Guest Mode
- Full user authentication system
- Register and login functionality
- Guest mode for trying the app without registration
- User data persistence (when logged in)

### 🎨 Modern Design
- Beautiful gradient backgrounds
- Islamic-inspired color scheme (emerald/teal)
- Smooth animations with Framer Motion
- Fully responsive design
- Dark mode support
- Modern shadcn/ui components

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM with SQLite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up the database:
   ```bash
   bun run db:push
   ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Guest Mode
Simply visit the app and start using it immediately in guest mode. Data will not be persisted when you leave.

### Registered User
1. Click the "Login" button in the header
2. Choose to login or register
3. Your data will be saved and available across sessions

### Adding Tasks
1. Navigate to the "Tasks" tab
2. Click "Add Task"
3. Fill in the task details
4. Click "Add Task" to save

### Adding Quran Reminders
1. Navigate to the "Quran Reminders" tab
2. Click "Add Reminder"
3. Select Surah and enter Ayah range
4. Set reminder time and add notes (optional)
5. Click "Add Reminder" to save

## API Routes

### Tasks
- `GET /api/tasks?userId={id}` - Get all tasks for a user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Quran Reminders
- `GET /api/quran-reminders?userId={id}` - Get all reminders for a user
- `POST /api/quran-reminders` - Create a new reminder
- `PATCH /api/quran-reminders/{id}` - Update a reminder
- `DELETE /api/quran-reminders/{id}` - Delete a reminder

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

## Database Schema

### User
- id: String (unique)
- email: String (unique)
- name: String?
- password: String?
- createdAt: DateTime
- updatedAt: DateTime

### Task
- id: String (unique)
- title: String
- description: String?
- completed: Boolean
- category: String
- priority: String
- dueDate: DateTime?
- userId: String?
- user: User (relation)
- createdAt: DateTime
- updatedAt: DateTime

### QuranReminder
- id: String (unique)
- surahNumber: Int
- surahName: String
- startAyah: Int
- endAyah: Int
- notes: String?
- completed: Boolean
- reminderTime: DateTime?
- userId: String?
- user: User (relation)
- createdAt: DateTime
- updatedAt: DateTime

## Design Principles

- **Simplicity**: Clean, uncluttered interface
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Fast loading, smooth interactions
- **Responsive**: Works on all device sizes
- **Privacy**: Guest mode available, data protection

## Future Enhancements

- Prayer time reminders
- Monthly/weekly progress reports
- Export data functionality
- Multiple language support
- Social sharing for achievements
- Integration with Quran API for verse display

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with ❤️ for the Muslim community to help organize their spiritual journey.

May Allah guide us all on the right path. 🌙
