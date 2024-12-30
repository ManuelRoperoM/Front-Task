import React, { createContext, useContext, useState } from 'react';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('1');

  return (
    <TasksContext.Provider value={{ tasks, setTasks, loading, setLoading, filter, setFilter }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks debe ser usado dentro de un TasksProvider');
  }
  return context;
};
