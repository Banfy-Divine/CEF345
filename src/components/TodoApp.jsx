import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/TodoApp.css';  // Update the import path as needed

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState('addTask');
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleReminderTimeChange = (e) => {
    setReminderTime(e.target.value);
  };

  const handleReminderDateChange = (date) => {
    setReminderDate(date);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const playAlarmSound = () => {
    const audio = new Audio('/src/assets/alarm-sound.mp3'); // Update path for Vite
    audio.play().catch((error) => console.error("Error playing sound:", error));
  };

  const handleAddTodo = () => {
    if (inputValue.trim() && !todos.some(todo => todo.task === inputValue.trim())) {
      const reminderDateTime = new Date(reminderDate);
      const [hours, minutes] = reminderTime.split(':');
      reminderDateTime.setHours(hours, minutes);

      setTodos([...todos, { task: inputValue.trim(), reminder: reminderDateTime, dueDate }]);
      setInputValue('');
      setReminderTime('');
      setReminderDate(new Date());
      setDueDate(new Date());
    }
  };

  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  useEffect(() => {
    const timers = todos.map((todo, index) => {
      const now = new Date();
      const timeDifference = todo.reminder - now;

      if (timeDifference > 0) {
        return setTimeout(() => {
          alert(`Reminder: ${todo.task}`);
          playAlarmSound();
          handleDeleteTodo(index);
        }, timeDifference);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [todos]);

  const renderAddTask = () => (
    <div>
      <h2>Add Task</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new task"
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setShowOptions(!showOptions)}>
          {showOptions ? 'Hide Options' : 'Show Options'}
        </button>
        {showOptions && (
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '10px' }}>
              <h3>Set Reminder</h3>
              <Calendar onChange={handleReminderDateChange} value={reminderDate} />
              <input
                type="time"
                value={reminderTime}
                onChange={handleReminderTimeChange}
              />
            </div>
            <div>
              <h3>Set Due Date</h3>
              <Calendar onChange={handleDueDateChange} value={dueDate} />
            </div>
          </div>
        )}
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo.task} - Due: {todo.dueDate.toLocaleDateString()} - Reminder: {todo.reminder.toLocaleString()}
            <button onClick={() => handleDeleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderCalendar = () => (
    <div>
      <h2>Calendar</h2>
      <Calendar onChange={handleDueDateChange} value={dueDate} />
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Do App</h1>
      <nav>
        <button onClick={() => setActiveMenu('addTask')}>Add Task</button>
        <button onClick={() => setActiveMenu('viewCalendar')}>View Calendar</button>
      </nav>
      <div style={{ marginTop: '20px' }}>
        {activeMenu === 'addTask' && renderAddTask()}
        {activeMenu === 'viewCalendar' && renderCalendar()}
      </div>
    </div>
  );
};

export default TodoApp;