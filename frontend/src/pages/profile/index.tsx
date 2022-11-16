import Head from "next/head";
import Link from "next/link";

import { useContext, useState } from "react";
import { Flex, Text, Heading, Box, Input, Button } from '@chakra-ui/react'
import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";

interface IUserProps{
    id: string;
    name: string;
    email: string;
    endereco: string | null;
}

interface IProfileProps{
    user: IUserProps;
    premium: boolean
}

export default function Profile({user, premium}: IProfileProps){
    const {logoutUser} = useContext(AuthContext)
    const [name, setName] = useState(user && user?.name);
    const [address, setAddress] = useState(user && user?.endereco);

    async function handleLogout(){
        await logoutUser();
    }

    async function handleUpdateUser(){
        if(name === ''){
            return;
        }
        try{
            const apiClient = setupAPIClient();
            await apiClient.put('users',{
                name: name,
                endereco: address
            })

            alert('Dados alterados com sucesso')
        }catch(err){
            console.log(err)
        }
    }

    return(
        <>
            <Head>
                <title>Minha conta - BarberPRO</title>
            </Head>

            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent='flex-start'>
                    <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
                        <Heading fontSize="3xl" color='orange.900' mt={4} mb={4} mr={4}>Minha Conta</Heading>
                    </Flex>

                    <Flex pt={8} pb={8} maxW="700px" w="100%" direction="column" alignItems="center" justifyContent="center" bg="barber.400">
                        <Flex direction='column' w="75%">
                            <Text color='white' mb={3} fontSize="xl" fontWeight="bold">
                                Nome da barberia
                            </Text>

                            <Input
                                w="100%"
                                focusBorderColor="orange.300"
                                color="white"
                                background="barber.400"
                                placeholder="Nome da sua barbearia"
                                borderColor="gray.700"
                                size="lg"
                                type="text"
                                mb={4}
                                _hover={{background: 'barber.400'}}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Text color='white' mb={3} fontSize="xl" fontWeight="bold">
                                Endereço
                            </Text>

                            <Input
                                w="100%"
                                focusBorderColor="orange.300"
                                color="white"
                                background="barber.400"
                                placeholder="Digite seu endereço"
                                borderColor="gray.700"
                                size="lg"
                                type="text"
                                mb={4}
                                _hover={{background: 'barber.400'}}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            <Text color='white' mb={3} fontSize="xl" fontWeight="bold">
                                Plano Atual
                            </Text>
                            <Flex
                            color="white"
                            w="100%"
                            mb={4}
                            p={1}
                            borderWidth={1}
                            borderColor="gray.700"
                            rounded={6}
                            background="barber.400"
                            alignItems="center"
                            justifyContent="space-between"
                            >
                                <Text p={2} fontSize="lg" color={premium ? '#4dffb4' : '#ff4d4d'}>
                                    Plano {premium ? 'Premium' : 'Grátis'}
                                </Text>

                                <Link href="/planos">
                                    <Box
                                    cursor="pointer"
                                    p={1}
                                    pl={2}
                                    pr={2}
                                    bg={premium ? '#00a141' : '#a10000'}
                                    rounded={4}
                                    mr={1}
                                    >
                                        Mudar plano
                                    </Box>
                                </Link>
                            </Flex>

                            <Button
                                w="100%"
                                mt={3}
                                mb={4}
                                bg={'orange.900'}
                                size="lg"
                                _hover={{ bg: '#ffb13e' }}
                                onClick={handleUpdateUser}
                            >Salvar</Button>
                            <Button
                                w="100%"
                                mb={6}
                                bg="transparent"
                                borderWidth={2}
                                borderColor="red.500"
                                color="red.500"
                                size="lg"
                                _hover={{bg: 'transparent'}}
                                onClick={handleLogout}
                            >
                                Sair da conta
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try{
        
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/me')

       const user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        endereco: response.data.endereco,
        
       }

       return{
        props:{
            user: user,
            premium: response.data?.subscriptions?.status === 'active' ? true : false
        }
       }

    } catch(err){
        console.log(err);
        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})