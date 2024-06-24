import React, { useState } from 'react';
import cross from '../assets/icon-cross.svg';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, toggleTodo, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleUpdate = () => {
    updateTodo(id, editedText);
    setIsEditing(false);
  };

  return (
    <div className="todo-item">
      <input type="checkbox" checked={completed} onChange={() => toggleTodo(id)} />
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
        />
      ) : (
        <span onDoubleClick={() => setIsEditing(true)} style={{ textDecoration: completed ? 'line-through' : 'none' }}>
          {text}
        </span>
      )}
      <div className="todo-actions">
        <button className="delete "onClick={() => deleteTodo(id)}>
          <img src={cross} alt="Delete" />
        </button>
        {!isEditing && (
          <button className="edit" onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
