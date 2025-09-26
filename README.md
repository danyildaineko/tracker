# Habit Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-blue.svg)](https://tailwindcss.com/)

A modern, responsive habit tracker application built with React and TailwindCSS. Features dark mode, streak tracking, drag-and-drop reordering, timer functionality, and local storage persistence.

## ✨ Features

- 📋 **Habit Management**: Create, edit, archive, and delete habits with drag-and-drop reordering
- 🎯 **Daily Tracking**: Mark habits as complete with visual feedback and keyboard shortcuts
- 🔥 **Streak Tracking**: Monitor your consistency with automatic streak counters
- ⏱️ **Built-in Timer**: Pomodoro-style timer with 8-hour progress tracking and session history
- 🌙 **Dark Mode**: Toggle between light and dark themes with system preference detection
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 📊 **Table View**: Calendar-style view with month navigation and today highlighting
- ⌨️ **Keyboard Shortcuts**: Efficient navigation and habit toggling with number keys (1-9)
- 💾 **Persistent Storage**: All data stored locally in browser with automatic saving
- 🎨 **Customizable**: Choose colors, emojis, and schedules for each habit
- 🚀 **No Build Required**: Pure HTML/CSS/JS - just open and use

## 🚀 Quick Start

1. **Clone or Download**: Get the project files
2. **Open**: Open `habit-tracker.html` in any modern web browser
3. **Start Tracking**: Begin adding and tracking your habits immediately

No installation, no build process, no server required!

## 📁 Project Structure

```
habit-tracker/
├── 📄 habit-tracker.html          # Main application entry point
├── 📁 assets/
│   ├── 🎨 css/
│   │   └── styles.css              # Custom CSS and theme enhancements
│   └── 📜 js/
│       ├── app.js                  # Core utilities and business logic
│       ├── components.js           # Main React components and app logic
│       └── ui-components.js        # Reusable UI components and timer
├── 📄 package.json                # Project metadata and dependencies
├── 📄 .gitignore                  # Git ignore rules
└── 📖 README.md                   # This documentation
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-9` | Toggle habits 1-9 for selected date |
| `N` | Create new habit |
| `T` | Go to today |
| `←` / `→` | Navigate to previous/next day |
| `ESC` | Close dialogs |

## 🛠️ Technical Stack

- **Frontend Framework**: React 18 (via CDN)
- **Styling**: TailwindCSS 3 (via CDN)
- **Build Tool**: Babel Standalone (in-browser JSX compilation)
- **Storage**: Browser localStorage API
- **Icons**: Unicode emojis and symbols
- **Responsive**: CSS Grid and Flexbox

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| Edge | 88+ |

## 📊 Data Storage

All data is stored locally using the browser's localStorage API:

- **Habits**: Names, colors, schedules, creation dates, and order
- **Completions**: Daily completion status for each habit
- **Timer**: Current session state and history
- **Preferences**: Theme selection and UI settings

**Privacy**: No data is sent to external servers. Everything stays on your device.

## 🎨 Customization

### Adding New Habit Colors
Edit the `ColorPicker` component in `assets/js/ui-components.js`:

```javascript
const options = [
  "bg-your-color-100 dark:bg-your-color-900/40",
  // Add more colors here
];
```

### Modifying Default Habits
Edit the `loadStore` function in `assets/js/app.js`:

```javascript
habits: [
  { name: "Your Habit", color: "bg-blue-100", icon: "🎯", ... },
  // Add more default habits
]
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add comments for complex logic
- Test in multiple browsers
- Keep the no-build philosophy (avoid compilation steps)
- Maintain backward compatibility

### Code Style

- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep components small and focused
- Use modern JavaScript (ES6+) features
- Follow React best practices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TailwindCSS](https://tailwindcss.com/)
- Inspired by habit tracking methodologies and productivity systems
- Thanks to all contributors and users providing feedback

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions
- **Documentation**: Check this README and inline code comments

---

**Made with ❤️ for productivity enthusiasts and habit builders**
