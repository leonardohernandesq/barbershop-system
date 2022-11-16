import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Sidebar } from '../../../components/sidebar'

import { FiArrowLeft } from 'react-icons/fi'

import {
    Flex,
    Text,
    Heading,
    Button,
    Input
} from '@chakra-ui/react'

import { canSSRAuth } from '../../../utils/canSSRAuth'
import { setupAPIClient } from '../../../services/api'
import Router from 'next/router'

interface INewHaircutProps{
    subscription: boolean;
    count: number;
}

export default function NewHaircut({subscription, count}: INewHaircutProps){
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')

    async function handleRegisterHaircut(){
        
        if(name === '' || price === ''){
            return;
        }

        try{
            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name: name,
                price: Number(price),
            })
            alert('Cadastrado!')
            Router.push("/haircuts")
        } catch(err){
            console.log(err)
            alert(err)
        }
    }


    return(
        <>
            <Head>
                <title>BarberPro - Novo modelo de corte</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        mb={6}
                        mt={2}
                    >
                        <Link href="#">
                            <Button
                                bg="barber.400"
                                p={4}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mr={3}
                                _hover={{bg:'barber.400'}}
                                onClick={() => Router.push("/haircuts")}
                            >
                                <FiArrowLeft color="orange" size={20} />
                                <Text color="white" ml={2}>Voltar</Text>
                            </Button>
                        </Link>
                        <Heading
                        color="orange.900"
                        size="lg"
                        mr={4}
                        >
                            Modelos de corte
                        </Heading>
                    </Flex>

                    <Flex
                        maxW="700px"
                        bg="barber.400"
                        w="100%"
                        direction="column"
                        align="center"
                        justify="center"
                        pt={8}
                        pb={8}
                    >
                        <Heading color="white" size="lg" mb={4}>
                            Cadastrar modelo
                        </Heading>

                        <Input 
                            placeholder='Nome do corte'
                            type="text"

                            background="gray.900"
                            focusBorderColor="orange.300"
                            borderColor="gray.700"
                            color="white"
                            variant="filled"
                            size="lg"
                            w="85%"
                            m={2}
                            _hover={{background: 'barber.400'}}
                            disabled={!subscription && count >= 3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Input 
                            placeholder='Valor do corte'
                            type="text"

                            background="gray.900"
                            focusBorderColor="orange.300"
                            borderColor="gray.700"
                            color="white"
                            variant="filled"
                            size="lg"
                            w="85%"
                            m={2}
                            _hover={{background: 'barber.400'}}
                            disabled={!subscription && count >= 3}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Button
                            w="85%"
                            size="lg"
                            color="gray.900"
                            bg="button.cta"
                            m={2}
                            transition="ease-in 0.3s"
                            _hover={{bg: "barber.900", color:"white"}}
                            disabled={!subscription && count >= 3}
                            onClick={handleRegisterHaircut}
                        >
                            Cadastrar
                        </Button>

                        {!subscription && count >= 3 && (
                            <Flex color="white" direction="column" align="center" mt={4}>
                                <Text>
                                    Você atingiu seu limite de corte.
                                </Text>
                                <Link href="/planos" >
                                    <Text color='green.400' fontWeight="bold">Seja Premium</Text>
                                </Link>
                            </Flex>
                        )}

                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try{
        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get('/haircut/check')
        const count = await apiClient.get('/haircut/count')

        return{
            props:{
                subscription: response.data?.subscriptions?.status === 'active' ? true : false,
                count: count.data
            }
        }

    } catch(err){
        console.log(err);

        return{
            redirect:{
                destination: '/dashboard',
                permanent: false,
            }
        }
    }
})