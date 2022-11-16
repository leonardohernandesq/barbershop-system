import { useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import logoImg from '../../../public/images/logo.svg';
import {Flex, Text, Center, Input, Button} from '@chakra-ui/react';

import {canSSRGuest} from '../../utils/canSSRGuest'

import { AuthContext } from '../../contexts/AuthContext';

import  Link from 'next/link';

export default function Login(){
    const {signIn} = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin(){
        if(email === '' && password === ''){
            alert('Preencha todos os campos')
        }

        await signIn({email, password})
    }

    return(
        <>
            <Head>
                <title>BarberPRO - Faça login para acessar</title>
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
                        onClick={handleLogin}
                    >
                        Acessar
                    </Button>

                    <Center>
                        <Link href="/register">
                            <Text color="white">Ainda não possui conta? <strong>Cadastre-se</strong></Text>
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