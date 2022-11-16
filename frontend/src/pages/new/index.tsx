import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import {
    Flex,
    Text,
    Button,
    Heading,
    useMediaQuery,
    Input,
    Select
} from '@chakra-ui/react'

import { FiArrowLeft } from 'react-icons/fi'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { Sidebar } from '../../components/sidebar';
import { ChangeEvent, useState } from 'react';
import { setupAPIClient } from '../../services/api';

interface IHaircutProps{
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string

}

interface IHaircutsProps{
    haircuts: IHaircutProps[];
}


export default function New({haircuts}: IHaircutsProps){
    const [isMobile] = useMediaQuery("(max-width:500px)")
    const [customer, setCustomer] = useState('')
    const [selectValue, setSelectValue] = useState(haircuts[0])

    function handleChangeSelect(id:string){
        const haircutItem = haircuts.find(item => item.id === id)

        setSelectValue(haircutItem)
    }

    async function handleRegister(){
        if(customer === ''){
            alert('Preencha todos os campos')
            return;
        }
        
        try{

            const apiClient = setupAPIClient();
            await apiClient.post('/schedule', {
                customer: customer,
                haircut_id: selectValue?.id
            })

            Router.push('/dashboard')

        }catch(err){
            console.log(err);
            alert('Erro ao registrar!')
        }
    }

    return(
        <>
        <Head>
            <title>BarberPRO - Novo Agendamento</title>
        </Head>
        <Sidebar>
            <Flex direction="column" mb={4} alignItems="flex-start" justifyContent="flex-start" mr={4}>
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
                            onClick={() => Router.push("/dashboard")}
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
                        Novo Agendamento
                    </Heading>
                </Flex>

                <Flex
                    maxW="700px"
                    pt={8}
                    pb={8}
                    width="100%"
                    direction="column"
                    align="center"
                    justify="center"
                    bg="barber.400"
                >

                    <Input 
                        placeholder='Nome do cliente'
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
                        value={customer}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
                    />

                    <Select
                        m={2}
                        w="85%"
                        borderColor="gray.700"
                        background="gray.900"
                        color="white"
                        size="lg"
                        _hover={{background: 'barber.400'}}
                        focusBorderColor="orange.300"
                        onChange={(e) => handleChangeSelect(e.target.value)}
                    >
                        {
                            haircuts?.map( item => (
                                <option style={{background:'#171923'}} key={item?.id} value={item.id}>{item.name}</option>
                            ))
                        }
                        
                    </Select>

                    <Button
                        w="85%"
                        size="lg"
                        color="gray.900"
                        bg="button.cta"
                        m={2}
                        _hover={{ bg: '#ffb13e' }}
                        onClick={handleRegister}
                    >
                        Cadastrar
                    </Button>

                </Flex>


            </Flex>
        </Sidebar>
    </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try{
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircuts',{
            params:{
                status: true
            }
        })

        if(response.data === null){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }
        return{
            props:{
                haircuts: response.data
            }
        }

    } catch(err){
        console.log(err)
        return{
            redirect:{
                destination: '/dashboard',
                permanent: false,
            }
        }
    }
}) 