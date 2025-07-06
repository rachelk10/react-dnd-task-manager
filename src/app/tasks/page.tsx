'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { DragEndEvent } from '@dnd-kit/core';


import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './tasks.css';

export default function StatsPage() {
  type Task = { id: string; text: string; completed: boolean };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isClient, setIsClient] = useState(false);        // מונע שגיאת Hydration

  /* חיישן לגרירה */
  const sensors = useSensors(useSensor(PointerSensor));

  /* טעינה רק בצד‑לקוח */
  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => {
    if (!isClient) return;
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, [isClient]);
  useEffect(() => {
    if (isClient) localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks, isClient]);

  /* פעולות */
  const addTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: uuidv4(), text: newTaskText, completed: false }]);
    setNewTaskText('');
  };
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));
  const toggleDone = (id: string) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const updateTask = (id: string) => {
    const t = tasks.find(t => t.id === id); if (!t) return;
    const txt = prompt('Update task text:', t.text);
    if (txt && txt.trim()) setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: txt } : task));
  };

  /* החלפת מיקומים לאחר גרירה */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    setTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  if (!isClient) return null; // לא מרנדר ב‑SSR

  return (
    <div className="task-page">
      <h1>📝 Task Manager</h1>
      <p className="drag-note">📦 You can drag and drop tasks to reorder them</p>

      {/* עטיפת הרשימה במנוע הגרירה */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <ul>
            {tasks.map(task => (
              <SortableItem
                key={task.id}
                task={task}
                onToggle={() => toggleDone(task.id)}
                onDelete={() => deleteTask(task.id)}
                onUpdate={() => updateTask(task.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="task-input-area">
        <input
          placeholder="new task"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>➕</button>
      </div>
    </div>
  );
}

/* פריט יחיד ברשימה – לא שינינו כלום בעיצוב, רק הוספנו תמיכה ב‑useSortable */
function SortableItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
}: {
  task: { id: string; text: string; completed: boolean };
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div className="task-left">
        {/* אזור הגרירה בלבד */}
        <span className="drag-handle" {...attributes} {...listeners} title="Drag to reorder">⠿</span>

        <span className="heart-icon" onClick={onToggle}>
          {task.completed ? '🩷' : '🖤'}
        </span>
        <span style={{
          color: task.completed ? '#aaa' : 'black',
          textDecoration: task.completed ? 'line-through' : 'none',
        }}>
          {task.text}
        </span>
      </div>

      <div className="task-actions">
        <button className="delete-button" onClick={onDelete}>🗑️</button>
        <button className="update-button" onClick={onUpdate}>✏️</button>
      </div>
    </li>

  );
}
