import React, { useEffect, useState } from 'react'
import { Card, Button, Spinner, Grid, Box, Flex } from "@chakra-ui/react"
import { Status } from "@/components/ui/status"
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import Icon from '@mdi/react';
import { mdiDeleteEmpty, mdiLayersEdit, mdiFolderPlusOutline } from '@mdi/js'
import {
    NativeSelectField,
    NativeSelectRoot,
  } from "@/components/ui/native-select"


const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const { token } = useAuth()
  const [filter, setFilter] = useState('1')



  useEffect(()=> {

    if (!token) {
        setError('No se encontró el token');
        setLoading(false);
        return;
    }

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
        <Button variant="outline" color={'black.300'}><Icon path={mdiFolderPlusOutline} size={1} /></Button>
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
