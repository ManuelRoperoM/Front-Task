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


const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const { token } = useAuth()
  const [filter, setFilter] = useState('1')
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)



  useEffect(()=> {

    if (!token) {
        setError('No se encontró el token');
        setLoading(false);
        return;
    }

    //GetTasks
    const fetchTasks = async (filterValue) => {
        try {
            const ENDPOINT_BACKEND = 'http://localhost:3000'
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
    const ENDPOINT_BACKEND = 'http://localhost:3000'
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
        <Grid templateColumns="repeat(3, 1fr)" gap="6">
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
                <Button variant="outline" color={'green.300'}><Icon path={mdiLayersEdit} size={1} /></Button>
                <Button variant="outline" color={'red.400'}><Icon path={mdiDeleteEmpty} size={1} /></Button>
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
