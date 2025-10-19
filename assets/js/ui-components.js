/**
 * Habit Tracker - UI Components
 * 
 * This file contains reusable UI components for the habit tracker application.
 * Includes components for habit display, editing, table views, timer functionality,
 * and various utility components.
 * 
 * @author Habit Tracker Contributors
 * @license MIT
 */

/**
 * Individual habit row component for list view
 * @param {Object} props - Component props
 * @param {Object} props.habit - Habit data object
 * @param {boolean} props.scheduled - Whether habit is scheduled for the date
 * @param {boolean} props.done - Whether habit is completed for the date
 * @param {string} props.date - ISO date string (YYYY-MM-DD)
 * @param {number} props.streak - Current habit streak
 * @param {Function} props.onToggle - Callback to toggle habit completion
 * @param {Function} props.onEdit - Callback to edit habit
 * @param {Function} props.onDelete - Callback to delete habit
 * @param {Function} props.onArchive - Callback to archive/unarchive habit
 * @param {number} props.index - Habit index for drag and drop
 * @param {Function} props.onReorder - Callback to reorder habits
 */
function HabitRow({ habit, scheduled, done, date, streak, onToggle, onEdit, onDelete, onArchive, index, onReorder }) {
  const dragIndex = useRef(null);
  return (
    <li
      className={classNames("group border rounded-xl p-3 mb-3 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm", !scheduled && !habit.archived && "opacity-60")}
      draggable
      onDragStart={(e)=>{ dragIndex.current = index; e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={(e)=>{ e.preventDefault(); }}
      onDrop={(e)=>{ e.preventDefault(); if (dragIndex.current!=null && dragIndex.current!==index) onReorder(dragIndex.current, index); dragIndex.current = null; }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className={classNames("w-6 h-6 rounded border flex items-center justify-center border-neutral-300 dark:border-neutral-700", done ? "bg-neutral-500 border-neutral-500 text-white" : "bg-white dark:bg-neutral-900")} title={done ? "Mark not done" : "Mark done"}>
          {done ? "✓" : ""}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={classNames("inline-flex items-center justify-center w-6 h-6 rounded", habit.color)}>{habit.icon || "•"}</span>
            <div className="font-medium truncate">{habit.name || <span className="text-neutral-400">Untitled habit</span>}</div>
            {habit.archived && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">archived</span>}
            {!scheduled && !habit.archived && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">not scheduled today</span>}
          </div>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="mr-3">Streak: <b>{streak}</b></span>
            <span className="mr-3">Created: {habit.createdAt}</span>
            <span>Repeat: {repeatLabel(habit.repeatDays)}</span>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
          <button className="px-2 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onEdit}>Edit</button>
          <button className="px-2 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onArchive}>{habit.archived?"Unarchive":"Archive"}</button>
          <button className="px-2 py-1 text-xs rounded border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </li>
  );
}

function WeekStrip({ days, pct, activeDate, onPick }) {
  return (
    <div className="flex items-center gap-2">
      {days.map((d, i) => (
        <button key={d} onClick={()=>onPick(d)} className={classNames("flex-1 rounded-lg p-2 border text-left border-transparent hover:border-neutral-300 dark:hover:border-neutral-700", d===activeDate?"border-black dark:border-white":"")}
          title={`${d} • ${pct[i]}% completed`}>
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{new Date(d).toLocaleDateString(undefined,{ weekday:'short'})}</div>
          <div className="text-sm">{d.slice(5)}</div>
          <div className="mt-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded">
            <div className="h-full rounded bg-black dark:bg-white" style={{ width: `${pct[i]}%` }} />
          </div>
        </button>
      ))}
    </div>
  );
}

function EditDialog({ initial, onSave, onClose, nameRef }) {
  const [draft, setDraft] = useState(initial);
  function setDay(dow, on) { setDraft(h => ({ ...h, repeatDays: on ? Array.from(new Set([...h.repeatDays, dow])).sort() : h.repeatDays.filter(x=>x!==dow) })); }
  
  // Handle ESC key to close dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-20 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 p-4" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-3">
          <div className={classNames("w-8 h-8 rounded flex items-center justify-center", draft.color)}>{draft.icon}</div>
          <input ref={nameRef} value={draft.name} onChange={e=>setDraft(h=>({ ...h, name: e.target.value }))} placeholder="Habit name" className="flex-1 px-3 py-2 border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium">Emoji</label>
            <input value={draft.icon} onChange={e=>setDraft(h=>({ ...h, icon: e.target.value }))} className="px-3 py-2 border rounded w-24 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium">Color</label>
            <ColorPicker value={draft.color} onChange={v=>setDraft(h=>({ ...h, color: v }))} />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium mb-1">Repeat on</label>
          <div className="grid grid-cols-7 gap-1">
            {"SMTWTFS".split("").map((lbl, i) => (
              <button key={i} onClick={()=>setDay(i, !draft.repeatDays.includes(i))} className={classNames("py-2 rounded border text-sm border-neutral-300 dark:border-neutral-700", draft.repeatDays.includes(i)?"bg-black text-white dark:bg-white dark:text-black":"bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800")}>{lbl}</button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="px-3 py-2 border rounded border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onClose}>Cancel</button>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border rounded border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={()=>setDraft(h=>({ ...h, archived: !h.archived }))}>{draft.archived?"Unarchive":"Archive"}</button>
            <button className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black" onClick={()=>onSave(draft)} disabled={!draft.name || !draft.name.trim()}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableView({ habits, days, store, onToggle, currentDate, onAddHabit, onReorder, showMonthHeader = false }) {
  const weekday = (d) => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' });
  
  // Fast add habit state
  const [newHabitName, setNewHabitName] = useState("");
  const newHabitInputRef = useRef(null);
  
  // Drag and drop state
  const dragIndex = useRef(null);
  
  // Calculate how many days can fit on screen and center around current date
  const [visibleDays, setVisibleDays] = useState(days);
  const tableRef = useRef(null);
  
  useEffect(() => {
    const calculateVisibleDays = () => {
      if (!tableRef.current) return;
      
      const containerWidth = tableRef.current.offsetWidth;
      const habitColumnWidth = 224; // w-56 = 14rem = 224px
      const dayColumnWidth = 48; // Approximate width for each day column
      const availableWidth = containerWidth - habitColumnWidth - 32; // Account for padding/borders
      const maxDays = Math.floor(availableWidth / dayColumnWidth);
      
      // Show at least 7 days (week view) and at most what fits
      const daysToShow = Math.max(7, Math.min(maxDays, days.length));
      
      // Find today's index in the days array
      const todayIndex = days.findIndex(d => d === currentDate);
      
      if (todayIndex === -1) {
        // If today is not in the range, show from beginning
        setVisibleDays(days.slice(0, daysToShow));
      } else {
        // Center the view around today
        const halfRange = Math.floor(daysToShow / 2);
        let startIndex = Math.max(0, todayIndex - halfRange);
        let endIndex = Math.min(days.length, startIndex + daysToShow);
        
        // Adjust if we're near the end
        if (endIndex - startIndex < daysToShow) {
          startIndex = Math.max(0, endIndex - daysToShow);
        }
        
        setVisibleDays(days.slice(startIndex, endIndex));
      }
    };
    
    calculateVisibleDays();
    window.addEventListener('resize', calculateVisibleDays);
    return () => window.removeEventListener('resize', calculateVisibleDays);
  }, [days, currentDate]);
  
  // Fast add habit function
  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: uid(),
        name: newHabitName.trim(),
        color: pickColor(),
        icon: "✅",
        repeatDays: [0,1,2,3,4,5,6], // Daily by default
        createdAt: currentDate,
        order: habits.length
      };
      onAddHabit(newHabit);
      setNewHabitName("");
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };
  
  // Get month, year and selected day from current date
  const monthYear = new Date(currentDate).toLocaleDateString(undefined, { 
    month: 'long', 
    year: 'numeric' 
  });
  const selectedDay = new Date(currentDate).toLocaleDateString(undefined, { 
    weekday: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="border rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      {/* Month and Year Header */}
      {showMonthHeader && (
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {monthYear}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {selectedDay}
            </p>
          </div>
        </div>
      )}
      
      <div ref={tableRef} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white dark:bg-neutral-900 px-3 py-2 text-left w-56">Trackers</th>
              {visibleDays.map((d, index) => {
                const isRealToday = d === isoDate(); // Real today
                const isSelectedDate = d === currentDate; // Selected date
                return (
                  <th key={d} className={classNames("px-2 py-1 font-normal min-w-[48px]", 
                    isSelectedDate 
                      ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" 
                      : isRealToday 
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        : "text-neutral-500 dark:text-neutral-400"
                  )}>
                    <div className="text-[10px] uppercase">{weekday(d).slice(0,1)}</div>
                    <div>{parseInt(d.slice(8),10)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {habits.map((h, index) => (
              <tr 
                key={h.id} 
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all duration-200"
                onDragOver={(e) => { 
                  e.preventDefault(); 
                  e.dataTransfer.dropEffect = "move";
                  if (dragIndex.current !== null && dragIndex.current !== index) {
                    e.currentTarget.style.borderTop = "2px solid #3b82f6";
                    e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderTop = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  e.currentTarget.style.borderTop = "";
                  e.currentTarget.style.backgroundColor = "";
                  if (dragIndex.current !== null && dragIndex.current !== index && onReorder) {
                    onReorder(dragIndex.current, index);
                  }
                }}
              >
                <td className="sticky left-0 bg-white dark:bg-neutral-900 px-3 py-2 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div 
                      className="mr-2 px-3 py-2 cursor-default hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors duration-200 min-w-[40px]" 
                      title="Drag to reorder"
                      draggable
                      onDragStart={(e) => { 
                        dragIndex.current = index; 
                        e.dataTransfer.effectAllowed = "move";
                        const row = e.currentTarget.closest('tr');
                        row.style.opacity = "0.6";
                        row.style.transform = "scale(1.02)";
                        row.style.transition = "all 0.2s ease";
                        row.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                        row.style.zIndex = "10";
                      }}
                      onDragEnd={(e) => {
                        const row = e.currentTarget.closest('tr');
                        row.style.opacity = "1";
                        row.style.transform = "scale(1)";
                        row.style.boxShadow = "none";
                        row.style.zIndex = "auto";
                        dragIndex.current = null;
                      }}
                    >
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {index + 1}
                      </span>
                    </div>
                    {h.name}
                  </div>
                </td>
                {visibleDays.map((d, colIndex) => {
                  const scheduled = isScheduled(h, d);
                  const done = hasCompleted(store, d, h.id);
                  const isRealToday = d === isoDate(); // Real today
                  const isSelectedDate = d === currentDate; // Selected date
                  return (
                    <td key={d} className={classNames('text-center align-middle p-0', 
                      isSelectedDate 
                        ? 'bg-orange-50 dark:bg-orange-900/20'
                        : isRealToday 
                          ? 'bg-neutral-100 dark:bg-neutral-800'
                          : '',
                      !scheduled && !isSelectedDate && !isRealToday && 'bg-neutral-100/60 dark:bg-neutral-800/40'
                    )}
                        title={d + (scheduled? (done? ' • done' : ' • scheduled') : ' • not scheduled')}>
                      {scheduled ? (
                        <button onClick={()=>onToggle(d,h)} className={classNames('w-8 h-8 m-1 rounded border inline-flex items-center justify-center', 
                          isSelectedDate 
                            ? 'border-orange-400' 
                            : isRealToday 
                              ? 'border-neutral-400'
                              : 'border-neutral-300 dark:border-neutral-700',
                          done 
                            ? isSelectedDate 
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'bg-neutral-500 border-neutral-500 text-white'
                            : isSelectedDate 
                              ? 'bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700'
                              : isRealToday 
                                ? 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        )}>
                          {done ? '✓' : ''}
                        </button>
                      ) : (
                        <div className="w-8 h-8 m-1" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Fast add habit row */}
            <tr>
              <td className="sticky left-0 bg-white dark:bg-neutral-900 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-5 h-5 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">+</span>
                  <input
                    ref={newHabitInputRef}
                    type="text"
                    placeholder="Add new tracker..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-2 py-1 text-sm border-none bg-transparent focus:outline-none placeholder-neutral-400 dark:placeholder-neutral-500"
                  />
                  {newHabitName.trim() && (
                    <button
                      onClick={handleAddHabit}
                      className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      Add
                    </button>
                  )}
                </div>
              </td>
              {visibleDays.map(d => {
                const isRealToday = d === isoDate(); // Real today
                const isSelectedDate = d === currentDate; // Selected date
                return (
                  <td key={d} className={classNames('text-center align-middle p-0',
                    isSelectedDate 
                      ? 'bg-orange-50 dark:bg-orange-900/20'
                      : isRealToday 
                        ? 'bg-neutral-100 dark:bg-neutral-800'
                        : ''
                  )}>
                    <div className="w-8 h-8 m-1" />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  const options = [
    "bg-neutral-100 dark:bg-neutral-800","bg-zinc-100 dark:bg-zinc-800","bg-slate-100 dark:bg-slate-800",
    "bg-rose-100 dark:bg-rose-900/40","bg-pink-100 dark:bg-pink-900/40","bg-fuchsia-100 dark:bg-fuchsia-900/40","bg-purple-100 dark:bg-purple-900/40","bg-violet-100 dark:bg-violet-900/40","bg-indigo-100 dark:bg-indigo-900/40",
    "bg-blue-100 dark:bg-blue-900/40","bg-sky-100 dark:bg-sky-900/40","bg-cyan-100 dark:bg-cyan-900/40","bg-teal-100 dark:bg-teal-900/40","bg-emerald-100 dark:bg-emerald-900/40","bg-green-100 dark:bg-green-900/40","bg-lime-100 dark:bg-lime-900/40",
    "bg-yellow-100 dark:bg-yellow-900/40","bg-amber-100 dark:bg-amber-900/40","bg-orange-100 dark:bg-orange-900/40","bg-red-100 dark:bg-red-900/40",
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(c => (
        <button key={c} onClick={()=>onChange(c)} className={classNames("w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700", c, value===c && "ring-2 ring-black dark:ring-white")} title={c} />
      ))}
    </div>
  );
}

// Utility functions
function repeatLabel(days) {
  if (days.length === 7) return "Daily";
  if (JSON.stringify(days) === JSON.stringify([1,2,3,4,5])) return "Weekdays";
  if (JSON.stringify(days) === JSON.stringify([0,6])) return "Weekends";
  const names = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; return days.map(d => names[d]).join(", ");
}
function pickColor() {
  const palette = ["bg-blue-100 dark:bg-blue-900/40","bg-amber-100 dark:bg-amber-900/40","bg-green-100 dark:bg-green-900/40","bg-rose-100 dark:bg-rose-900/40","bg-indigo-100 dark:bg-indigo-900/40","bg-lime-100 dark:bg-lime-900/40"]; 
  return palette[Math.floor(Math.random()*palette.length)];
}

// Timer Component
function TimerComponent() {
  const [time, setTime] = useState(() => {
    try {
      const saved = localStorage.getItem('timer-state');
      if (saved) {
        const timerState = JSON.parse(saved);
        if (timerState.isRunning && timerState.startTime) {
          // Calculate elapsed time since last save
          const now = Date.now();
          const elapsed = Math.floor((now - timerState.startTime) / 1000);
          return timerState.time + elapsed;
        }
        return timerState.time || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  });
  
  const [isRunning, setIsRunning] = useState(() => {
    try {
      const saved = localStorage.getItem('timer-state');
      if (saved) {
        const timerState = JSON.parse(saved);
        return timerState.isRunning || false;
      }
      return false;
    } catch {
      return false;
    }
  });
  
  const [timerHistory, setTimerHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('timer-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('timer-history', JSON.stringify(timerHistory));
  }, [timerHistory]);

  // Save timer state to localStorage
  const saveTimerState = (currentTime, running) => {
    const timerState = {
      time: currentTime,
      isRunning: running,
      startTime: running ? Date.now() : null
    };
    localStorage.setItem('timer-state', JSON.stringify(timerState));
  };

  // Update timer state when time or running status changes
  useEffect(() => {
    saveTimerState(time, isRunning);
  }, [time, isRunning]);

  // Update document title when timer is running
  useEffect(() => {
    if (isRunning && time > 0) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      document.title = `Tracker: ${timeString}`;
    } else {
      document.title = 'Tracker';
    }
  }, [time, isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    // Clear saved timer state
    localStorage.removeItem('timer-state');
  };

  const saveTimer = () => {
    if (time > 0) {
      const newEntry = {
        id: uid(),
        duration: time,
        timestamp: new Date().toISOString(),
        date: isoDate(),
        note: "" // Empty note that can be edited later
      };
      setTimerHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10 entries
      resetTimer();
    }
  };

  const deleteHistoryEntry = (id) => {
    setTimerHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const updateEntryNote = (id, note) => {
    setTimerHistory(prev => prev.map(entry => 
      entry.id === id ? { ...entry, note } : entry
    ));
  };

  // Calculate progress (8 hours = 100%)
  const maxSeconds = 8 * 3600; // 8 hours in seconds
  const progressPercent = Math.min((time / maxSeconds) * 100, 100);
  const overflowPercent = time > maxSeconds ? ((time - maxSeconds) / maxSeconds) * 100 : 0;
  
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
      <div className="text-center mb-3">
        <div className="text-lg font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {formatTime(time)}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden relative">
            {/* Hour markers - 8 sections */}
            <div className="absolute inset-0 flex">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-neutral-600 dark:bg-neutral-300" 
                  style={{ 
                    width: '2px',
                    marginLeft: `calc(${(i + 1) * 12.5}% - 1px)`,
                    height: '100%'
                  }}
                />
              ))}
            </div>
            
            {/* Progress fill */}
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            
            {/* Overflow indicator */}
            {overflowPercent > 0 && (
              <div 
                className="h-full bg-red-500 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(overflowPercent, 100)}%` }}
              />
            )}
          </div>
          
          {/* Progress text */}
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {time >= maxSeconds 
              ? `${Math.floor(time / 3600)}h ${Math.floor((time % 3600) / 60)}m (${Math.round((time / maxSeconds) * 100)}%)`
              : `${Math.round(progressPercent)}% of 8 hours`
            }
          </div>
        </div>
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-3 py-1 text-sm bg-neutral-500 text-white rounded hover:bg-neutral-600"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-3 py-1 text-sm bg-neutral-500 text-white rounded hover:bg-neutral-600"
            >
              Pause
            </button>
          )}
          {time > 0 && (
            <button
              onClick={saveTimer}
              className="px-3 py-1 text-sm bg-neutral-500 text-white rounded hover:bg-neutral-600"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {timerHistory.length > 0 && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
          <h3 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Recent Sessions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {timerHistory.map(entry => (
              <div key={entry.id} className="bg-neutral-50 dark:bg-neutral-800 rounded p-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300">{formatTime(entry.duration)}</span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 ml-2">
                    <input
                      type="text"
                      placeholder=""
                      value={entry.note || ""}
                      onChange={(e) => updateEntryNote(entry.id, e.target.value)}
                      className="flex-1 text-xs px-1 py-0 border-0 bg-transparent text-neutral-600 dark:text-neutral-400 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none text-left"
                    />
                    <button
                      onClick={() => deleteHistoryEntry(entry.id)}
                      className="text-neutral-500 hover:text-neutral-700 px-1 py-0.5 text-xs rounded hover:bg-neutral-50 dark:hover:bg-neutral-900/20 flex-shrink-0"
                      title="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Initialize the app
function initializeApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(HabitApp));
}
