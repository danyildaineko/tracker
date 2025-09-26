# Contributing to Habit Tracker

Thank you for your interest in contributing to Habit Tracker! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- Basic knowledge of HTML, CSS, JavaScript, and React
- Text editor or IDE of your choice

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/habit-tracker.git`
3. Open `habit-tracker.html` in your browser
4. Start making changes!

**No build process required** - just edit the files and refresh your browser.

## 📁 Project Architecture

### File Structure
```
habit-tracker/
├── habit-tracker.html          # Main entry point
├── assets/
│   ├── css/
│   │   └── styles.css          # Custom CSS styles
│   └── js/
│       ├── app.js              # Core utilities and business logic
│       ├── components.js       # Main React components
│       └── ui-components.js    # Reusable UI components
├── package.json                # Project metadata
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

### Key Components

#### `app.js` - Core Logic
- Date and time utilities
- localStorage management
- Habit business logic (streaks, scheduling)
- Helper functions

#### `components.js` - Main App
- `HabitApp` - Main application component
- `useDarkMode` - Theme management hook
- Application state management
- Keyboard shortcuts

#### `ui-components.js` - UI Components
- `HabitRow` - Individual habit display
- `TableView` - Calendar table view
- `TimerComponent` - Built-in timer
- `EditDialog` - Habit editing modal
- `ColorPicker` - Color selection

## 🎯 How to Contribute

### Types of Contributions
- 🐛 **Bug fixes** - Fix issues or improve existing functionality
- ✨ **New features** - Add new capabilities or enhancements
- 📚 **Documentation** - Improve README, comments, or guides
- 🎨 **UI/UX improvements** - Enhance design and user experience
- 🧪 **Testing** - Add tests or improve browser compatibility
- 🔧 **Refactoring** - Improve code quality and organization

### Development Workflow

1. **Create an Issue** (for new features or major changes)
   - Describe the problem or enhancement
   - Discuss the approach with maintainers
   - Get feedback before starting work

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Make Changes**
   - Follow the coding standards below
   - Test in multiple browsers
   - Add comments for complex logic

4. **Test Your Changes**
   - Open `habit-tracker.html` in different browsers
   - Test both light and dark modes
   - Verify keyboard shortcuts work
   - Check mobile responsiveness

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   # or
   git commit -m "fix: resolve issue description"
   ```

6. **Push and Create PR**
   ```bash
   git push origin your-branch-name
   ```
   Then create a Pull Request on GitHub.

## 📝 Coding Standards

### JavaScript Style
- Use modern ES6+ features
- Prefer `const` and `let` over `var`
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused

```javascript
/**
 * Calculate habit streak from a given date
 * @param {Object} store - Application state
 * @param {Object} habit - Habit object
 * @param {string} fromDate - ISO date string (YYYY-MM-DD)
 * @returns {number} Current streak count
 */
function calcStreak(store, habit, fromDate) {
  // Implementation...
}
```

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use descriptive prop names
- Add PropTypes or TypeScript if needed

```javascript
/**
 * Individual habit row component
 * @param {Object} props - Component props
 * @param {Object} props.habit - Habit data
 * @param {boolean} props.scheduled - Whether habit is scheduled today
 * @param {Function} props.onToggle - Toggle completion callback
 */
function HabitRow({ habit, scheduled, onToggle }) {
  // Implementation...
}
```

### CSS/Styling
- Use TailwindCSS classes primarily
- Add custom CSS only when necessary
- Follow mobile-first responsive design
- Support both light and dark themes

### File Organization
- Keep related functionality together
- Use clear section comments
- Maintain consistent indentation
- Remove unused code and comments

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] All keyboard shortcuts work
- [ ] Drag and drop reordering functions
- [ ] Timer persists across page refreshes
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive design
- [ ] Data persists in localStorage
- [ ] All buttons and interactions work

### Browser Testing
Test in at least:
- Chrome (latest)
- Firefox (latest)
- Safari (if on macOS)
- Edge (latest)

### Feature Testing
When adding new features:
- Test with empty state (no habits)
- Test with many habits (10+)
- Test edge cases and error conditions
- Verify accessibility (keyboard navigation)

## 🎨 Design Guidelines

### UI Principles
- **Simplicity** - Keep the interface clean and uncluttered
- **Consistency** - Use consistent spacing, colors, and patterns
- **Accessibility** - Support keyboard navigation and screen readers
- **Responsiveness** - Work well on all device sizes

### Color Scheme
- Use neutral colors as the base
- Provide clear contrast ratios
- Support both light and dark themes
- Use color meaningfully (green for success, red for danger)

### Typography
- Use system fonts for performance
- Maintain readable font sizes
- Provide good line spacing
- Use font weights meaningfully

## 📋 Pull Request Guidelines

### PR Title Format
- `feat: add new feature description`
- `fix: resolve specific issue`
- `docs: update documentation`
- `style: improve UI/styling`
- `refactor: improve code structure`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] All existing features work

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process
1. Automated checks (if any)
2. Code review by maintainers
3. Testing by reviewers
4. Approval and merge

## 🐛 Reporting Issues

### Bug Reports
Include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console errors (if any)

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples (if helpful)

## 💬 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers learn
- Focus on the code, not the person

### Communication
- Use GitHub Issues for bugs and features
- Use GitHub Discussions for questions
- Be clear and concise in communication
- Provide context and examples

## 🏆 Recognition

Contributors will be:
- Listed in the README acknowledgments
- Credited in release notes
- Invited to be maintainers (for significant contributions)

## 📚 Resources

### Learning Resources
- [React Documentation](https://reactjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [React Developer Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)

---

Thank you for contributing to Habit Tracker! 🎉
