import React, { useEffect, useRef, useState } from "react";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select"
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { useTasks } from "./TaskContext";
import { Button, Fieldset, Flex, Input } from "@chakra-ui/react";
import Icon from '@mdi/react';
import {mdiFolderPlusOutline } from '@mdi/js'
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Swal from 'sweetalert2';

const TaskFilter = () => {

    const [error, setError] = useState([])
    const titleRef = useRef(null)
    const descriptionRef = useRef(null)
    const { tasks, setTasks, setLoading, filter, setFilter } = useTasks();
    const { token } = useAuth()
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
                console.log('tareas filtradas: ', filterValue)
                let url = ENDPOINT_BACKEND
                if (filterValue === '1') url = url+'/tasks'
                if (filterValue === '2') url = url+'/tasks/filter?taskStatus=pending'
                if (filterValue === '3') url = url+'/tasks/filter?taskStatus=completed'
                console.log("URL final: ", url);
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                })
                console.log("Respuesta: ",response.data);
                setTasks(response.data)
                setLoading(false)
                
            } catch (error) {
                console.error(error)
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
    return(
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

    )
}

export default TaskFilter