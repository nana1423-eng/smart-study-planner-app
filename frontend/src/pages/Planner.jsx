import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';

export default function Planner() {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysWindow, setDaysWindow] = useState([]);

  // Generate an array of the next 7 date strings (YYYY-MM-DD)
  const generateDateWindow = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.get('/scheduler');
      const sessions = res.data;
      
      const window = generateDateWindow();
      setDaysWindow(window);
      
      // Initialize empty columns for the 7 days window
      const newCols = {};
      window.forEach(date => newCols[date] = []);

      // Group active sessions into the window
      sessions.forEach(session => {
        const dateStr = session.scheduledDate;
        if (newCols[dateStr]) {
          newCols[dateStr].push(session);
        }
      });
      
      // Sort each column by startTime
      Object.keys(newCols).forEach(date => {
        newCols[date].sort((a, b) => {
          if (!a.startTime || !b.startTime) return 0;
          return a.startTime.localeCompare(b.startTime);
        });
      });

      setColumns(newCols);
    } catch (err) {
      console.error("Failed to fetch planner schedule", err);
      setError("Could not load your planner data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const formatTimeStr = (timeString) => {
    if (!timeString) return '';
    const [hours, mins] = timeString.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${mins} ${ampm}`;
  };

  const addMinutesToTimeStr = (timeString, minutesToAdd) => {
    const [h, m, s] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, s || 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const outH = String(date.getHours()).padStart(2, '0');
    const outM = String(date.getMinutes()).padStart(2, '0');
    return `${outH}:${outM}:00`;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return; 
    }

    const startColumn = [...columns[source.droppableId]];
    const finishColumn = [...columns[destination.droppableId]];
    const [movedSession] = startColumn.splice(source.index, 1);

    // Optimistic UI Update calculations
    let newStartTime = "09:00:00"; 
    if (finishColumn.length > 0) {
      // Append to the bottom of the column -> calculate based on the current Last item
      const lastSession = finishColumn[finishColumn.length - 1];
      if (lastSession.endTime) {
        newStartTime = addMinutesToTimeStr(lastSession.endTime, 15); // Add a 15 min buffer
      }
    }

    // Mutate session visually
    movedSession.scheduledDate = destination.droppableId;
    movedSession.startTime = newStartTime;
    movedSession.endTime = addMinutesToTimeStr(newStartTime, movedSession.durationMinutes);
    finishColumn.splice(destination.index, 0, movedSession);

    setColumns({
      ...columns,
      [source.droppableId]: startColumn,
      [destination.droppableId]: finishColumn
    });

    // Background Persist
    try {
      await api.put(`/scheduler/${movedSession.id}/move`, {
        date: destination.droppableId,
        startTime: newStartTime
      });
    } catch (error) {
      console.error("Failed to persist shift", error);
      // Revert if failed (simple visual catch)
      fetchSchedule(); 
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100 h-screen flex flex-col max-w-[100vw] overflow-hidden">
      
      {/* Header Segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Visual Planner</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">Drag and drop sessions across the next 7 days to override the matrix.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/schedule" className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-6 rounded-full transition-colors border border-slate-600">
            Timeline View
          </Link>
          <button onClick={fetchSchedule} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-center mb-6 flex-shrink-0">{error}</div>
      )}

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start px-2 min-w-max">
            {daysWindow.map((dateStr) => {
              const dateObj = new Date(dateStr + 'T00:00:00');
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
              const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              return (
                <div key={dateStr} className={`flex flex-col bg-white dark:bg-slate-800/40 border rounded-[2rem] w-80 h-full max-h-full flex-shrink-0 transition-colors ${isToday ? 'border-indigo-500/40 shadow-[0_0_25px_rgba(79,70,229,0.05)]' : 'border-slate-300 dark:border-slate-700/50'}`}>
                  
                  {/* Column Header */}
                  <div className={`p-5 border-b rounded-t-[2rem] ${isToday ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white dark:bg-slate-800/60 border-slate-300 dark:border-slate-700/50'}`}>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex justify-between items-center">
                      {isToday ? 'Today' : dayName.split(',')[0]}
                      {isToday && <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Now</span>}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{monthDay}</p>
                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>{columns[dateStr]?.length} Blocks</span>
                      <span>
                        {Math.floor(columns[dateStr]?.reduce((acc, s) => acc + s.durationMinutes, 0) / 60)}h{' '}
                        {columns[dateStr]?.reduce((acc, s) => acc + s.durationMinutes, 0) % 60}m
                      </span>
                    </div>
                  </div>

                  {/* Droppable Zone */}
                  <Droppable droppableId={dateStr}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex-1 p-4 overflow-y-auto custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-500/5' : ''}`}
                      >
                        {columns[dateStr]?.map((session, index) => (
                          <Draggable key={String(session.id)} draggableId={String(session.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-4 p-4 rounded-2xl border transition-all ${snapshot.isDragging ? 'bg-slate-700 border-indigo-500 shadow-2xl scale-105 rotate-1 z-50' : session.status === 'COMPLETED' ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-500'}`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${session.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}>
                                    {session.assignment.priority || 'NORMAL'}
                                  </span>
                                  {session.startTime && (
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                      {formatTimeStr(session.startTime)}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-slate-900 dark:text-white font-bold leading-tight line-clamp-2">{session.assignment.title}</h4>
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg px-2 py-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {session.durationMinutes}m
                                  </div>
                                  {session.subject && (
                                    <span className="text-xs font-medium text-slate-500">{session.subject.name}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      
    </div>
  );
}
