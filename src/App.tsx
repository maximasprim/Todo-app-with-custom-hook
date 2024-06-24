import React, {  useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './App.css';
import useLocalStorage from './hooks/useLocalStorage';



const App: React.FC = () => {
  const {state, dispatch} = useLocalStorage();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortCriteria, setSortCriteria] = useState<'creation-date' | 'completion-status'>('creation-date');
  const [isDarkMode, setIsDarkMode] = useState(false);
 

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch({ type: 'ADD_TODO', text: newTodo });
      setNewTodo('');
    }
  };

  const handleUpdateTodo = (id: number, text: string) => {
    dispatch({ type: 'UPDATE_TODO', id, text });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleClearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const sortedTodos = [...state].sort((a, b) => {
    if (sortCriteria === 'completion-status') {
      return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    } else if (sortCriteria === 'creation-date') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const filteredTodos = sortedTodos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const itemsLeft = state.filter(todo => !todo.completed).length;

  return (
    <div className={`container ${isDarkMode ? 'dark' : ''}`}>
      <div className="todo1">
        <h1>Todo </h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {isDarkMode ? 'Switch to Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="sort-options">
        <label>Sort by: </label>
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value as 'creation-date' | 'completion-status')}>
          <option value="creation-date">Creation Date</option>
          <option value="completion-status">Completion Status</option>
        </select>
      </div>

      <TodoList
        todos={filteredTodos}
        toggleTodo={(id) => dispatch({ type: 'TOGGLE_TODO', id })}
        deleteTodo={(id) => dispatch({ type: 'DELETE_TODO', id })}
        updateTodo={handleUpdateTodo}
      />

      <div className="footer">
        <span>{itemsLeft} items left</span>
        <div className="filters">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>
            Completed
          </button>
        </div>
        <button className="clearCompleted" onClick={handleClearCompleted}>Clear Completed</button>
      </div>
    </div>
  );
};

export default App;
