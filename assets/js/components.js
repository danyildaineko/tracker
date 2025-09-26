/**
 * Habit Tracker - Main React Components
 * 
 * This file contains the main React components and application logic for the
 * habit tracker. It manages the overall application state, user interactions,
 * and coordinates between different UI components.
 * 
 * @author Habit Tracker Contributors
 * @license MIT
 */

/**
 * Custom hook for managing dark mode theme
 * Handles theme persistence and system preference detection
 * @returns {Object} { dark: boolean, setDark: function }
 */
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.setItem(THEME_KEY, 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem(THEME_KEY, 'light'); }
  }, [dark]);
  return { dark, setDark };
}

function HabitApp() {
  const [store, setStore] = useState(() => loadStore());
  const [date, setDate] = useState(() => isoDate());
  const [filter, setFilter] = useState("all"); // all | active | archived
  const [view, setView] = useState("table"); // list | table
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [showDateTabs, setShowDateTabs] = useState(false); // Toggle for date tabs
  const [showTimer, setShowTimer] = useState(true); // Toggle for timer
  const newNameRef = useRef(null);
  const { dark, setDark } = useDarkMode();

  useEffect(() => saveStore(store), [store]);

  useEffect(() => {
    const onKey = (e) => {
      // Skip if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === "ArrowLeft") setDate(d => addDays(d, -1));
      if (e.key === "ArrowRight") setDate(d => addDays(d, +1));
      if (e.key.toLowerCase() === "t") setDate(isoDate());
      if (e.key.toLowerCase() === "n") { e.preventDefault(); startCreate(); }
      
      // Handle number keys (1-9) to toggle habits
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const habitIndex = num - 1;
        const activeHabits = habits.filter(h => !h.archived);
        if (habitIndex < activeHabits.length) {
          const habit = activeHabits[habitIndex];
          if (isScheduled(habit, date)) {
            toggle(habit, date);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [habits, date, toggle]);

  const habits = useMemo(() => {
    return [...store.habits]
      .filter(h => (filter === "all" ? true : filter === "active" ? !h.archived : !!h.archived))
      .filter(h => h.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.order - b.order);
  }, [store.habits, filter, query]);

  const scheduledToday = habits.filter(h => isScheduled(h, date) && !h.archived);
  const completedToday = scheduledToday.filter(h => hasCompleted(store, date, h.id));
  const progress = scheduledToday.length ? Math.round((completedToday.length / scheduledToday.length) * 100) : 0;

  function toggle(h, d = date) {
    setStore(prev => {
      const list = new Set(prev.completions[d] || []);
      if (list.has(h.id)) list.delete(h.id); else list.add(h.id);
      return { ...prev, completions: { ...prev.completions, [d]: [...list] } };
    });
  }
  function startCreate() {
    const h = { id: uid(), name: "", color: pickColor(), icon: "✅", repeatDays: [0,1,2,3,4,5,6], createdAt: isoDate(), order: store.habits.length };
    setEditing(h); setTimeout(() => newNameRef.current?.focus(), 0);
  }
  function saveHabit(h) {
    setStore(prev => { const exists = prev.habits.find(x => x.id === h.id); const habits = exists ? prev.habits.map(x => x.id === h.id ? h : x) : [...prev.habits, h]; return { ...prev, habits }; });
    setEditing(null);
  }
  function deleteHabit(id) {
    if (!confirm("Delete habit? This does not remove past checkmarks.")) return;
    setStore(prev => ({ habits: prev.habits.filter(h => h.id !== id), completions: prev.completions }));
  }
  function clearToday() { if (!confirm("Uncheck all for this day?")) return; setStore(prev => ({ ...prev, completions: { ...prev.completions, [date]: [] } })); }
  function reorder(from, to) {
    setStore(prev => { const hs = [...prev.habits].sort((a,b)=>a.order-b.order); const [moved] = hs.splice(from, 1); hs.splice(to, 0, moved); const withOrder = hs.map((h, i) => ({ ...h, order: i })); return { ...prev, habits: withOrder }; });
  }

  const weekStart = startOfWeek(date, 1);
  const weekDays = range(7).map(i => addDays(weekStart, i));
  const weekPct = weekDays.map(d => { const sh = store.habits.filter(h => isScheduled(h, d) && !h.archived); const ch = sh.filter(h => hasCompleted(store, d, h.id)); return sh.length ? Math.round((ch.length / sh.length) * 100) : 0; });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="font-semibold tracking-tight">Tracker</div>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={()=>setDate(d=>addDays(d,-1))}>←</button>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="px-2 py-1 border rounded text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700" />
            <button className="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={()=>setDate(d=>addDays(d,1))}>→</button>
            <button className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={()=>setDate(isoDate())}>Today</button>
            <button onClick={()=>setShowDateTabs(!showDateTabs)} className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" title={showDateTabs ? "Hide date tabs" : "Show date tabs"}>
              {showDateTabs ? "Hide Tabs" : "Show Tabs"}
            </button>
            <button onClick={()=>setShowTimer(!showTimer)} className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" title={showTimer ? "Hide timer" : "Show timer"}>
              {showTimer ? "Hide Timer" : "Timer"}
            </button>
            <button onClick={()=>setDark(!dark)} className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">{dark ? "Dark" : "Light"}</button>
          </div>
        </div>
        {showDateTabs && (
          <div className="mx-auto max-w-6xl px-4 pb-3">
            <WeekStrip days={weekDays} pct={weekPct} activeDate={date} onPick={setDate} />
          </div>
        )}
      </header>

      <main className="flex justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-6xl p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-300">{scheduledToday.length} scheduled • {completedToday.length} done</div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={startCreate} className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">New tracker</button>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
            <div className="h-full bg-neutral-500 dark:bg-neutral-400 progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{progress}% complete</div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Shortcuts: N=new, T=today, ←/→ navigate, 1-9=toggle trackers</span>
        </div>

        {view === 'list' ? (
          <ul>
            {habits.map((h, i) => (
              <HabitRow
                key={h.id}
                habit={h}
                date={date}
                scheduled={isScheduled(h, date)}
                done={hasCompleted(store, date, h.id)}
                streak={calcStreak(store, h, date)}
                onToggle={()=>toggle(h)}
                onEdit={()=>setEditing(h)}
                onDelete={()=>deleteHabit(h.id)}
                onArchive={()=>saveHabit({ ...h, archived: !h.archived })}
                index={i}
                onReorder={reorder}
              />
            ))}
          </ul>
        ) : (
          <TableView habits={habits.filter(h=>!h.archived)} days={monthRange(date)} store={store} onToggle={(d,h)=>toggle(h,d)} currentDate={date} onAddHabit={saveHabit} onReorder={reorder} />
        )}

        {showTimer && (
          <div className="mt-6">
            <TimerComponent />
          </div>
        )}
        </div>
      </main>

      {editing && (
        <EditDialog initial={editing} onClose={()=>setEditing(null)} onSave={saveHabit} nameRef={newNameRef} />
      )}

      <footer className="mx-auto max-w-6xl p-6 text-xs text-neutral-500 dark:text-neutral-400">
        Built with localStorage. Your data stays in your browser.
      </footer>
    </div>
  );
}
