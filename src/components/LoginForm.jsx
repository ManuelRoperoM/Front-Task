import { useRef, useState } from 'react'
import {
  Box,
  Button,
  Center,
  Fieldset,
  Stack,
  Input,
  Flex
} from '@chakra-ui/react'
import { Field } from "@/components/ui/field"
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import "./tasks.css"

export const LoginForm = () => {
  const nameRef = useRef(null)
  const passwordRef = useRef(null)
  const { saveToken } = useAuth();
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = nameRef.current.value
    const password = passwordRef.current.value
    const ENDPOINT_BACKEND = import.meta.env.VITE_ENDPOINT_BACKEND
    try {
        const response = await axios.post(`${ENDPOINT_BACKEND}/auth`, { name: name, password: password})
        const token = response.data.token
        saveToken(token)
        navigate('/tasks')
        
    } catch (error) {
        setError('Credenciales incorrectas')
        console.error(error);
        if (error.status === 404) {
            alert('Credenciales incorrectas')
        }else {
            alert('error inesperado, intentelo nuevamente')
        }
    }
  }

  return (
    <div className='wrapped_login' background="red" width="100%" height="100%">
    <Center minWidth={500} width="80%" height={300} background='gray.100' p={4}> 
        <form onSubmit={handleSubmit}>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>Login</Fieldset.Legend>
                    <Fieldset.HelperText>
                        Por favor inicia sesion para continuar.
                    </Fieldset.HelperText>
                </Stack>
                <Fieldset.Content>
                    <Field label="Name">
                        <Input name="name" background="white" ref={nameRef}/>
                    </Field>
                    <Field label="Password">
                        <Input name="password" background="white" type="password" ref={passwordRef}/>
                    </Field>
                </Fieldset.Content>
                <Button background="black" _hover={{ background: 'gray.700', transform: 'scale(1.05)' }} type="submit" alignSelf="flex-center">
                    Submit
                </Button>
            </Fieldset.Root>
        </form>
    </Center>
    </div>
  )
}
