import { useState, useContext } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import logoImg from '../../../public/images/logo.svg';
import {Flex, Text, Center, Input, Button} from '@chakra-ui/react';

import { AuthContext } from '../../contexts/AuthContext';
import { canSSRGuest } from '../../utils/canSSRGuest'

import  Link from 'next/link';

export default function Register(){
  const {signUp} = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleRegister(){
    if(name === '' && email === '' && password === ''){
      alert('Preencha todos os campos')
    }
    
    await signUp({name, email, password})
  }
  
  return(
    <>
      <Head>
        <title>BarberPRO - Criação de conta </title>
      </Head>
      <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
        
        <Flex width={640} direction="column" p={14} rounded={8}>
            <Center p={6}>
                <Image 
                    src={logoImg}
                    quality={100}
                    alt="logo barberPro"
                    width={240}
                />
            </Center>

            <Input 
                background="barber.400"
                _hover={{background: 'barber.400'}}
                focusBorderColor="orange.300"
                color="white"
                variant="filled"
                size="lg"
                placeholder='Nome da barbearia'
                type="text"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Input 
                background="barber.400"
                _hover={{background: 'barber.400'}}
                focusBorderColor="orange.300"
                color="white"
                variant="filled"
                size="lg"
                placeholder='email@email.com'
                type="email"
                mb={3}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
                background="barber.400"
                _hover={{background: 'barber.400'}}
                focusBorderColor="orange.300"
                color="white"
                variant="filled"
                size="lg"
                placeholder='**********'
                type="password"
                mb={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                background="button.cta"
                mb={6}
                size='lg'
                _hover={{bg: "#ffb13e"}}
                onClick={handleRegister}
            >
                Cadastrar
            </Button>

            <Center>
                <Link href="/login">
                    <Text color="white">Já possui conta? <strong>Entre Aqui</strong></Text>
                </Link>
            </Center>
            
        </Flex>

      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async () => {
  return{
      props:{}
  }
})