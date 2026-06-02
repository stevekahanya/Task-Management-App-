import { useState } from 'react';

const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const [updating, setUpdating] = useState(false);

  const cycleStatus = async () => {
    const cycle = { todo: 'in_progress', in_progress: 'done', done: 'todo' };
    setUpdating(true);
    await onUpdate(task.id, { status: cycle[task.status] });
    setUpdating(false);
  };

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className={`task-card priority-${task.priority} status-${task.status}`}>
      <div className="task-card-header">
        <div
          className="priority-dot"
          style={{ background: PRIORITY_COLORS[task.priority] }}
          title={`${task.priority} priority`}
        />
        <button
          className={`status-badge status-${task.status}`}
          onClick={cycleStatus}
          disabled={updating}
          title="Click to cycle status"
        >
          {updating ? '…' : STATUS_LABELS[task.status]}
        </button>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="icon-btn" title="Edit">✎</button>
          <button onClick={() => onDelete(task.id)} className="icon-btn danger" title="Delete">✕</button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-footer">
        {task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map(tag => (
              <span key={tag.id} className="tag" style={{ background: tag.color + '22', color: tag.color, borderColor: tag.color + '44' }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {task.due_date && (
          <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? '⚠ ' : ''}
            {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
