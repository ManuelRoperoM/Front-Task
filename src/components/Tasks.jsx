import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Spinner, Grid, Box, Flex, Fieldset, Input, Text } from "@chakra-ui/react"
import { Status } from "@/components/ui/status"
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import Icon from '@mdi/react';
import { mdiDeleteEmpty, mdiLayersEdit, mdiFolderPlusOutline } from '@mdi/js'
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select"
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import Swal from 'sweetalert2';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const { token } = useAuth()
  const [filter, setFilter] = useState('1')
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const ENDPOINT_BACKEND = import.meta.env.VITE_ENDPOINT_BACKEND



  useEffect(()=> {

    if (!token) {
        setError('No se encontró el token');
        setLoading(false);
        return;
    }

    //GetTasks
    const fetchTasks = async (filterValue) => {
        try {
            let url = ENDPOINT_BACKEND
            console.log(filterValue);
            
            if (filterValue === '1') url = url+'/tasks'
            if (filterValue === '2') url = url+'/tasks/filter?taskStatus=pending'
            if (filterValue === '3') url = url+'/tasks/filter?taskStatus=completed'
            console.log("Token: ",token);
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            })
            setTasks(response.data)
            setLoading(false)
            
        } catch (error) {
            console.log(error);
            
            setError('Error a cargar los datos')
            setLoading(false)
        }
    }
    fetchTasks(filter)
  }, [filter])

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  //Create Tasks
  const handleSubmit = async (e) => {
    e.preventDefault()
    const title = titleRef.current.value
    const description = descriptionRef.current.value
    try {
        const response = await axios.post(`${ENDPOINT_BACKEND}/tasks`, 
            { title: title, 
                description: description
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        if (response.status === 201) {
            if (filter === '1' || filter === '2') {
                setTasks((prevTasks) => [...prevTasks, response.data]);
            }
            Swal.fire({
                title: '¡Tarea creada con éxito!',
                text: 'La tarea se ha creado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              });
          }

    } catch (error) {
        console.error('Error creating task:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al crear la tarea.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
    }
    
  }

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
    <>
    <h1 mb={4}><strong>Tasks</strong>Manager</h1>
    <Flex alignItems="center" gap="2" m={4}>
        Filter:
        <NativeSelectRoot>
            <NativeSelectField value={filter} onChange={handleFilterChange}>
                <option value="1">All</option>
                <option value="2">Pending</option>
                <option value="3">Completed</option>
            </NativeSelectField>
        </NativeSelectRoot>
        <DialogRoot>
            <DialogTrigger asChild>
                <Button variant="outline" color={'black.300'}><Icon path={mdiFolderPlusOutline} size={1} /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nueva tarea</DialogTitle>
                </DialogHeader>
                <DialogBody>
            <form onSubmit={handleSubmit}>
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>
                        <Field label="Title">
                            <Input name="title" background="white" ref={titleRef}/>
                        </Field>
                        <Field label="Description">
                            <Input name="description" background="white" ref={descriptionRef}/>
                        </Field>
                    </Fieldset.Content>
                    <DialogTrigger asChild>
                        <Button background="black" _hover={{ background: 'gray.700', transform: 'scale(1.05)' }} type="submit" alignSelf="flex-center">
                            Crear
                        </Button>
                    </DialogTrigger>
                </Fieldset.Root>
            </form>
            </DialogBody>
        <DialogCloseTrigger />
        </DialogContent>
        </DialogRoot>
    </Flex>

    {loading ? (
      <div><Spinner size="sm" /></div>
    ) : (
      <div>
        {tasks.length > 0 ? (
        <Grid templateColumns="repeat(auto-fit, minmax(320px, 1fr))" gap="6">
          {tasks.map((task, index) => (
            <Card.Root key={index} width="320px">
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
                onChange={() => toggleTaskStatus(task.id, task.completed)} // Llamamos a la función
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
      </div>
    )}
    </>
  )
}
export default Tasks;
