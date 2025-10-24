import React, { useState } from 'react';
import { X } from 'lucide-react';

// SVG Icons Components
const TasksIcon = ({ active }) => (
  <svg viewBox="0 0 512 512" fill={active ? "#DC2626" : "currentColor"} style={{width: '28px', height: '28px'}}>
    <path d="M152 120c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h208c26.51 0 48-21.49 48-48V168c0-26.51-21.49-48-48-48H152zm0-40h208c48.6 0 88 39.4 88 88v224c0 48.6-39.4 88-88 88H152c-48.6 0-88-39.4-88-88V168c0-48.6 39.4-88 88-88z"/>
    <rect x="200" y="200" width="112" height="20" rx="10"/>
    <rect x="200" y="250" width="112" height="20" rx="10"/>
    <rect x="200" y="300" width="112" height="20" rx="10"/>
    <path d="M155 205l8 8 20-20-8-8z"/>
    <path d="M155 255l8 8 20-20-8-8z"/>
    <path d="M155 305l8 8 20-20-8-8z"/>
  </svg>
);

const AddIcon = ({ active }) => (
  <svg viewBox="0 0 512 512" fill={active ? "#DC2626" : "currentColor"} style={{width: '28px', height: '28px'}}>
    <rect x="80" y="120" width="352" height="320" rx="60" fill="none" stroke="currentColor" strokeWidth="32"/>
    <rect x="80" y="60" width="352" height="100" rx="20" fill="#DC2626"/>
    <circle cx="140" cy="90" r="15" fill="#1f1f1f"/>
    <path d="M256 220v120M196 280h120" stroke="currentColor" strokeWidth="40" strokeLinecap="round"/>
  </svg>
);

const DoneIcon = ({ active }) => (
  <svg viewBox="0 0 512 512" fill={active ? "#DC2626" : "currentColor"} style={{width: '28px', height: '28px'}}>
    <defs>
      <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#FF6B6B'}}/>
        <stop offset="100%" style={{stopColor: '#FFB347'}}/>
      </linearGradient>
    </defs>
    <rect x="64" y="64" width="384" height="384" rx="80" fill="url(#checkGrad)"/>
    <path d="M170 256l60 60 110-110" stroke="white" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg viewBox="0 0 512 512" fill={active ? "#DC2626" : "currentColor"} style={{width: '28px', height: '28px'}}>
    <circle cx="200" cy="200" r="120" fill="none" stroke="#FFC107" strokeWidth="32"/>
    <circle cx="200" cy="200" r="90" fill="white"/>
    <rect x="290" y="290" width="160" height="60" rx="30" fill="#FF1744" transform="rotate(45 370 320)"/>
  </svg>
);

const MatrixIcon = ({ active }) => (
  <svg viewBox="0 0 512 512" fill={active ? "#DC2626" : "currentColor"} style={{width: '28px', height: '28px'}}>
    <rect x="80" y="80" width="160" height="160" rx="20" fill="#3B82F6"/>
    <rect x="272" y="80" width="160" height="160" rx="20" fill="#3B82F6"/>
    <rect x="80" y="272" width="160" height="160" rx="20" fill="#FF6B9D"/>
    <rect x="272" y="272" width="160" height="160" rx="20" fill="#FF6B9D"/>
    <rect x="100" y="100" width="50" height="8" rx="4" fill="white"/>
    <rect x="100" y="120" width="50" height="8" rx="4" fill="white"/>
    <rect x="292" y="100" width="50" height="8" rx="4" fill="white"/>
    <rect x="100" y="292" width="50" height="8" rx="4" fill="white"/>
    <rect x="292" y="292" width="50" height="8" rx="4" fill="white"/>
  </svg>
);

export default function SmartTodoApp() {
  const [currentView, setCurrentView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [newTask, setNewTask] = useState({
    name: '',
    priority: 'someday',
    deadline: ''
  });

  // Add Task
  const addTask = () => {
    if (newTask.name.trim()) {
      setTasks([...tasks, { 
        ...newTask, 
        id: Date.now(),
        done: false,
        createdAt: new Date()
      }]);
      setNewTask({ name: '', priority: 'someday', deadline: '' });
      setCurrentView('tasks');
    }
  };

  // Toggle Done
  const toggleDone = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  // Delete Task
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setDeletedTasks([taskToDelete, ...deletedTasks]);
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Undo Delete
  const undoDelete = () => {
    if (deletedTasks.length > 0) {
      const [lastDeleted, ...rest] = deletedTasks;
      setTasks([...tasks, lastDeleted]);
      setDeletedTasks(rest);
    }
  };

  // Filter and Sort Tasks
  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => !task.done);
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Sort
    const sortFunctions = {
      name: (a, b) => a.name.localeCompare(b.name),
      priority: (a, b) => {
        const order = { now: 0, someday: 1, anyday: 2 };
        return order[a.priority] - order[b.priority];
      },
      deadline: (a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
    };

    return filtered.sort(sortFunctions[sortBy]);
  };

  // Get Matrix Tasks
  const getMatrixTasks = () => {
    const activeTasks = tasks.filter(t => !t.done);
    const matrix = {
      urgentImportant: [],
      urgentNotImportant: [],
      notUrgentImportant: [],
      notUrgentNotImportant: []
    };

    activeTasks.forEach(task => {
      const isUrgent = task.priority === 'now';
      const hasDeadline = Boolean(task.deadline);
      
      if (isUrgent && hasDeadline) matrix.urgentImportant.push(task);
      else if (isUrgent && !hasDeadline) matrix.urgentNotImportant.push(task);
      else if (!isUrgent && hasDeadline) matrix.notUrgentImportant.push(task);
      else matrix.notUrgentNotImportant.push(task);
    });

    return matrix;
  };

  // Main Tasks View
  const TasksView = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4" style={{background: '#fafafa'}}>
        {getFilteredTasks().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No tasks yet!</p>
            <p className="text-sm">Tap the Add button to create your first task</p>
          </div>
        ) : (
          getFilteredTasks().map(task => (
            <div key={task.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200 flex items-start gap-3">
              <button
                onClick={() => toggleDone(task.id)}
                className="w-6 h-6 rounded-md border-2 border-red-600 flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                {task.done && <span className="text-red-600 text-sm">✓</span>}
              </button>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{task.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    task.priority === 'now' ? 'bg-red-100 text-red-700' :
                    task.priority === 'someday' ? 'bg-gray-100 text-gray-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                  {task.deadline && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      📅 {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <button onClick={() => deleteTask(task.id)} className="text-red-600 text-xl p-1">
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
      
      {deletedTasks.length > 0 && (
        <button
          onClick={undoDelete}
          className="absolute top-20 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm"
        >
          ↶ Undo
        </button>
      )}
    </>
  );

  // Add Task View
  const AddTaskView = () => (
    <div className="flex-1 overflow-y-auto p-4" style={{background: '#fafafa'}}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Task Name</label>
          <input
            type="text"
            value={newTask.name}
            onChange={(e) => setNewTask({...newTask, name: e.target.value})}
            placeholder="Enter task name..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Priority Level</label>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="now">Now (Urgent)</option>
            <option value="someday">Someday</option>
            <option value="anyday">Anyday</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Deadline (Optional)</label>
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={addTask}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          ✓ Add Task
        </button>
      </div>
    </div>
  );

  // Search View
  const SearchView = () => (
    <>
      <div className="bg-white p-4 border-b border-gray-200">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search tasks..."
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setFilterPriority('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filterPriority === 'all' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterPriority('now')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filterPriority === 'now' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          🔴 Now
        </button>
        <button
          onClick={() => setFilterPriority('someday')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filterPriority === 'someday' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          🟡 Someday
        </button>
        <button
          onClick={() => setFilterPriority('anyday')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filterPriority === 'anyday' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          ⚪ Anyday
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4" style={{background: '#fafafa'}}>
        {getFilteredTasks().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No results found</p>
          </div>
        ) : (
          getFilteredTasks().map(task => (
            <div key={task.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200 flex items-start gap-3">
              <button
                onClick={() => toggleDone(task.id)}
                className="w-6 h-6 rounded-md border-2 border-red-600 flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                {task.done && <span className="text-red-600 text-sm">✓</span>}
              </button>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{task.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    task.priority === 'now' ? 'bg-red-100 text-red-700' :
                    task.priority === 'someday' ? 'bg-gray-100 text-gray-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                  {task.deadline && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      📅 {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  // Matrix View
  const MatrixView = () => {
    const matrix = getMatrixTasks();
    
    return (
      <div className="flex-1 overflow-y-auto p-3" style={{background: '#fafafa'}}>
        <div className="grid grid-cols-2 gap-3 h-full">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 overflow-y-auto">
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold mb-3 text-center">
              🔴 Urgent & Important
            </div>
            {matrix.urgentImportant.map(task => (
              <div key={task.id} className="bg-gray-50 p-2 rounded-lg mb-2 text-sm">
                {task.name}
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 overflow-y-auto">
            <div className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-xs font-semibold mb-3 text-center">
              🟠 Urgent, Not Important
            </div>
            {matrix.urgentNotImportant.map(task => (
              <div key={task.id} className="bg-gray-50 p-2 rounded-lg mb-2 text-sm">
                {task.name}
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 overflow-y-auto">
            <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-semibold mb-3 text-center">
              🔵 Not Urgent, Important
            </div>
            {matrix.notUrgentImportant.map(task => (
              <div key={task.id} className="bg-gray-50 p-2 rounded-lg mb-2 text-sm">
                {task.name}
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 overflow-y-auto">
            <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold mb-3 text-center">
              ⚪ Not Urgent, Not Important
            </div>
            {matrix.notUrgentNotImportant.map(task => (
              <div key={task.id} className="bg-gray-50 p-2 rounded-lg mb-2 text-sm">
                {task.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-lg bg-black flex items-center justify-center">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23fef3c7' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='%231f1f1f'%3E∞%3C/text%3E%3C/svg%3E"
            alt="Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Smart To-do Manager</h1>
      </div>

      {/* Content */}
      {currentView === 'tasks' && <TasksView />}
      {currentView === 'add' && <AddTaskView />}
      {currentView === 'search' && <SearchView />}
      {currentView === 'matrix' && <MatrixView />}

      {/* Done Tasks Modal */}
      {showDoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50" onClick={() => setShowDoneModal(false)}>
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">✅ Done Tasks</h2>
              <button onClick={() => setShowDoneModal(false)} className="text-gray-500 text-2xl">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {tasks.filter(t => t.done).length === 0 ? (
                <p className="text-center py-12 text-gray-500">No completed tasks yet!</p>
              ) : (
                tasks.filter(t => t.done).map(task => (
                  <div key={task.id} className="bg-green-50 rounded-xl p-4 mb-3 border border-green-200">
                    <h3 className="font-semibold text-gray-900 line-through mb-2">{task.name}</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleDone(task.id)}
                        className="text-sm text-red-600 font-medium"
                      >
                        Mark Incomplete
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-sm text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg">
        <button
          onClick={() => setCurrentView('tasks')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentView === 'tasks' ? 'bg-red-100' : ''
          }`}
        >
          <TasksIcon active={currentView === 'tasks'} />
          <span className={`text-xs font-medium ${currentView === 'tasks' ? 'text-red-600' : 'text-gray-600'}`}>
            Tasks
          </span>
        </button>
        
        <button
          onClick={() => setCurrentView('add')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentView === 'add' ? 'bg-red-100' : ''
          }`}
        >
          <AddIcon active={currentView === 'add'} />
          <span className={`text-xs font-medium ${currentView === 'add' ? 'text-red-600' : 'text-gray-600'}`}>
            Add
          </span>
        </button>
        
        <button
          onClick={() => setShowDoneModal(true)}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
        >
          <DoneIcon active={false} />
          <span className="text-xs font-medium text-gray-600">Done</span>
        </button>
        
        <button
          onClick={() => setCurrentView('search')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentView === 'search' ? 'bg-red-100' : ''
          }`}
        >
          <SearchIcon active={currentView === 'search'} />
          <span className={`text-xs font-medium ${currentView === 'search' ? 'text-red-600' : 'text-gray-600'}`}>
            Search
          </span>
        </button>
        
        <button
          onClick={() => setCurrentView('matrix')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentView === 'matrix' ? 'bg-red-100' : ''
          }`}
        >
          <MatrixIcon active={currentView === 'matrix'} />
          <span className={`text-xs font-medium ${currentView === 'matrix' ? 'text-red-600' : 'text-gray-600'}`}>
            Matrix
          </span>
        </button>
      </div>
    </div>
  );
}