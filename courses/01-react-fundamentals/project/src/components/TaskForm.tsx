import { useState, FormEvent } from 'react';
import type { Task } from './TaskList';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  existingCategories?: string[];
}

const DEFAULT_CATEGORIES = ['General', 'Work', 'Personal'];

export default function TaskForm({ onAddTask, existingCategories = DEFAULT_CATEGORIES }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }
    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onAddTask({
      id: Date.now(),
      title: trimmedTitle,
      description: description.trim(),
      priority,
      completed: false,
      category: category || 'General',
      tags,
      dueDate: dueDate ? dueDate : undefined,
    });
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setTagsInput('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="task-form-category">Category</label>
        <select id="task-form-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {existingCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="task-tags-input">Tags (comma-separated)</label>
        <input
          id="task-tags-input"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="a, b, c"
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="task-due-date-input">Due date (optional)</label>
        <input
          id="task-due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {error && <p id="task-form-error" role="alert">{error}</p>}
      <button type="submit">Add Task</button>
    </form>
  );
}
