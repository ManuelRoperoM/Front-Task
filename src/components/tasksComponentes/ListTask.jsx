import { Card, Button, Grid, Box, Flex, Input, Text } from "@chakra-ui/react"
import { Status } from "@/components/ui/status"
import axios from 'axios'
import { useTasks } from "./TaskContext";
import Swal from 'sweetalert2';
import { Checkbox } from "@/components/ui/checkbox"
import Icon from '@mdi/react';
import { mdiDeleteEmpty, mdiLayersEdit } from '@mdi/js'
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const ListTask = () => {
  const { tasks, setTasks, loading } = useTasks();
  const { token } = useAuth()
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const ENDPOINT_BACKEND = import.meta.env.VITE_ENDPOINT_BACKEND

  //Actualizar
  const updateTask = async (task) => {
    try {
        const response = await axios.put(`${ENDPOINT_BACKEND}/tasks/${task.id}`, 
            { 
                title: updatedTitle, 
                description: updatedDescription
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        if (response.status === 200) {
            setTasks((prevTasks) => prevTasks.map((t) => 
                t.id === task.id ? { ...t, title: updatedTitle, description: updatedDescription } : t
            ))
            Swal.fire({
                title: '¡Tarea actualizada con éxito!',
                text: 'La tarea se ha actualizada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              });
          }
    } catch (error) {
        if (updatedTitle) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar la tarea.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'El titulo no puede estar vacio.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
        }
    } finally {
        setUpdatedDescription('')
        setUpdatedTitle('')
    }    
  }

  //Eliminar
  const deleteTask = async (task) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡Esta acción no se puede deshacer!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });
    if (result.isConfirmed) {
        try {
    
            const response = await axios.delete(`${ENDPOINT_BACKEND}/tasks/${task.id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            if (response.status === 200) {
                setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
                Swal.fire({
                    title: '¡Tarea eliminada con éxito!',
                    text: 'La tarea se ha eliminado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                  });
              }
        } catch (error) {
            if (updatedTitle) {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar la tarea.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                  });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'El titulo no puede estar vacio.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                  });
            }
        } 
    }
  }

  //Cambiar el estado
  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const response = await axios.put(
        `${ENDPOINT_BACKEND}/tasks/complete/${taskId}`,
        {
          completed: !currentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, completed: !currentStatus }
              : task
          )
        );
        Swal.fire({
          title: '¡Estado actualizado!',
          text: `La tarea ha sido marcada como ${!currentStatus ? 'Completed' : 'Pending'}.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error cambiando estado de la tarea:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cambiar el estado de la tarea.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

    return (
        <Box>
        {tasks.length > 0 ? (
        <Grid className='wrapper_grid' templateColumns="repeat(auto-fit, minmax(320px, 1fr))" gap="6">
          {tasks.map((task, index) => (
            <Card.Root className='children_grid' key={index} width="320px">
                   <Box position="absolute" top="1" right="2">
                    {task.completed ? (
                    <Status value="success">Completed</Status>
                    ) : (
                    <Status value="warning">Pending</Status>
                    )}
                </Box>
              <Card.Body gap="2">
                <Card.Title mt="2">{task.title}</Card.Title>
                <Card.Description>
                  {task.description}
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="flex-end">
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTaskStatus(task.id, task.completed)}
              >
                Marcar como Completed
              </Checkbox>
              <PopoverRoot>
                <PopoverTrigger asChild>
                <Button variant="outline" color={'green.300'}><Icon path={mdiLayersEdit} size={1} /></Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        <Flex flexDirection={'column'} gap={2}>
                            <PopoverTitle fontWeight="medium">UpdateTask</PopoverTitle>
                            <Text my="4">Actualiza tu tarea</Text>
                            <Input placeholder="Titulo" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)}  size="sm" />
                            <Input placeholder="Descripción" value={updatedDescription}  onChange={(e) => setUpdatedDescription(e.target.value)} size="sm" />
                            <Button background="black" onClick={() => updateTask(task)} alignSelf="flex-center">Actualizar</Button>
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
               </PopoverRoot>
                <Button variant="outline" color={'red.400'} onClick={() => deleteTask(task)}><Icon path={mdiDeleteEmpty} size={1}  /></Button>
              </Card.Footer>
            </Card.Root>
          ))}
          </Grid>
        ) : (
          <p>No hay tareas disponibles</p>
        )}
      </Box>
    )
}

export default ListTask