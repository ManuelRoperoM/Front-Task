import React, { useState } from 'react'
import { Spinner } from "@chakra-ui/react"
import TaskFilter from './tasksComponentes/TasksFilter'
import { TasksProvider, useTasks } from './tasksComponentes/TaskContext'
import ListTask from './tasksComponentes/ListTask'
import "./tasks.css"

const TasksContent = () => {
  const { loading } = useTasks();


  const ENDPOINT_BACKEND = import.meta.env.VITE_ENDPOINT_BACKEND
  
  return (
    <>
      <h1 mb={4}><strong>Tasks</strong>Manager</h1>
      <TaskFilter />
    {loading ? (
      <div><Spinner size="sm" /></div>
    ) : (
      <ListTask />
    )}
    </>
  )
}
    

  const Tasks = () => {
    return(
      <TasksProvider>
        <TasksContent />
      </TasksProvider>
    )
  }

export default Tasks;
