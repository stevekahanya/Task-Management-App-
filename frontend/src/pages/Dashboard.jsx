import { useState, useEffect } from 'react';
import { tasksAPI, tagsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const STATUSES = ['todo', 'in_progress', 'done'];
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [view, setView] = useState('board'); // board | list

  const fetchAll = async () => {
    try {
      const [taskData, tagData] = await Promise.all([
        tasksAPI.getAll(Object.fromEntries(Object.entries(filter).filter(([, v]) => v))),
        tagsAPI.getAll()
      ]);
      setTasks(taskData.tasks);
      setTags(tagData.tags);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const handleCreate = async (data) => {
    const res = await tasksAPI.create(data);
    setTasks(prev => [res.task, ...prev]);
  };

  const handleUpdate = async (id, data) => {
    const res = await tasksAPI.update(id, data);
    setTasks(prev => prev.map(t => t.id === id ? res.task : t));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    await tasksAPI.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingTask) {
      await handleUpdate(editingTask.id, data);
    } else {
      await handleCreate(data);
    }
    setEditingTask(null);
  };

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Tasks</h1>
          <p className="subtitle">Welcome back, {user?.username}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.done}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.total - stats.done}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-card urgent">
          <span className="stat-value">{stats.high}</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="view-toggle">
          <button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}>⊞ Board</button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>☰ List</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading tasks…</p>
        </div>
      ) : view === 'board' ? (
        <div className="kanban-board">
          {STATUSES.map(status => (
            <div key={status} className={`kanban-column status-col-${status}`}>
              <div className="column-header">
                <span className={`col-dot status-${status}`} />
                <h3>{STATUS_LABELS[status]}</h3>
                <span className="col-count">{tasksByStatus(status).length}</span>
              </div>
              <div className="column-tasks">
                {tasksByStatus(status).length === 0 ? (
                  <div className="empty-column">No tasks here</div>
                ) : (
                  tasksByStatus(status).map(task => (
                    <TaskCard key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={handleEdit} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create your first task!</p>
              <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ New Task</button>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={handleEdit} />
            ))
          )}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          task={editingTask}
          tags={tags}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
