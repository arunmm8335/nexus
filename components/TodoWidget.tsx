
import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Circle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { TodoItem } from '../types';

interface TodoWidgetProps {
  onTodosUpdate: (todos: TodoItem[]) => void;
}

const DEFAULT_TASKS: TodoItem[] = [
  { id: 'init-1', text: 'Review system architecture notes', completed: false, createdAt: Date.now() },
  { id: 'init-2', text: 'Commit daily code progress', completed: false, createdAt: Date.now() },
  { id: 'init-3', text: 'Hydrate: Drink 500ml water', completed: false, createdAt: Date.now() },
  { id: 'init-4', text: 'Complete one algorithm challenge', completed: false, createdAt: Date.now() },
];

export const TodoWidget: React.FC<TodoWidgetProps> = ({ onTodosUpdate }) => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('nexus_todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return DEFAULT_TASKS;
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_todos', JSON.stringify(todos));
    onTodosUpdate(todos);
  }, [todos, onTodosUpdate]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const item: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: Date.now()
    };
    setTodos([item, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <GlassCard title="Active Directives" className="h-full min-h-[400px] flex flex-col">
      <form onSubmit={addTodo} className="mb-6 relative">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Input new command..."
          className="w-full border rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none transition-colors"
          style={{ 
            backgroundColor: 'var(--input-bg)', 
            borderColor: 'var(--glass-border)',
            color: 'var(--text-main)'
          }}
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {todos.length === 0 && (
          <div className="text-center text-sm py-12 italic" style={{ color: 'var(--text-muted)' }}>
            No active directives. Systems idle.
          </div>
        )}
        {todos.map(todo => (
          <div 
            key={todo.id}
            className={`group flex items-center justify-between p-3 rounded-lg transition-all border border-transparent`}
            style={{ 
              backgroundColor: todo.completed ? 'transparent' : 'var(--input-bg)',
              opacity: todo.completed ? 0.5 : 1
            }}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <button 
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${todo.completed ? 'bg-neutral-700 border-neutral-700' : 'border-neutral-500 hover:border-neutral-400'}`}
              >
                {todo.completed ? <Check className="w-3 h-3 text-white" /> : null}
              </button>
              <span 
                className={`text-sm truncate select-none ${todo.completed ? 'line-through' : ''}`}
                style={{ color: todo.completed ? 'var(--text-muted)' : 'var(--text-main)' }}
              >
                {todo.text}
              </span>
            </div>
            <button 
              onClick={() => removeTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
