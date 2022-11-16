import { useState, ChangeEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Sidebar } from '../../components/sidebar'

import { FiArrowLeft } from 'react-icons/fi'

import {
    Flex,
    Text,
    Heading,
    Button,
    Input,
    Switch,
    Stack
} from '@chakra-ui/react'

import { canSSRAuth } from '../../utils/canSSRAuth'
import { setupAPIClient } from '../../services/api'
import Router from 'next/router'

interface IHaircutProps{
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}
interface IEditHaircutProps{
    haircut: IHaircutProps;
    subscription: boolean;
}

export default function NewHaircut({haircut, subscription}: IEditHaircutProps){
    const [name, setName] = useState(haircut?.name)
    const [price, setPrice] = useState(haircut?.price)
    const [valueSwitch, setValueSwitch] = useState(haircut?.status ? 'enabled' : 'disabled')

    async function handleChangeStatus(e: ChangeEvent<HTMLInputElement>){
        if(valueSwitch === "enabled"){
            setValueSwitch("disabled")
        } else{
            setValueSwitch("enabled")
        } 
    }

    async function handleUpdateHaircut(){
        if(name === '' || price === ''){
            return;
        }

        try{
            const apiClient = setupAPIClient();
            await apiClient.put('/haircut', {
                name: name,
                price: Number(price),
                status: valueSwitch === 'enabled' ? true : false,
                haircut_id: haircut.id
            })
            alert('Editado!')
            Router.push("/haircuts")
        } catch(err){
            console.log(err)
            alert(err)
        }
    }


    return(
        <>
            <Head>
                <title>BarberPro - Editando modelo de corte</title>
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
                            Editar corte
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
                            Editar modelo
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
                            disabled={!subscription}
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
                            disabled={!subscription}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Stack align="center" mt={3} mb={3} direction="row" justifyContent="flex-start" w="85%">
                            <Text color="white" fontWeight="bold">{valueSwitch === 'disabled' ? 'Desativo' : 'Ativo' }</Text>
                            <Switch 
                                colorScheme="green"
                                size="lg"
                                value={valueSwitch}
                                disabled={!subscription}
                                onChange={(e:ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}
                                isChecked={valueSwitch === 'disabled' ? false : true}
                            />
                        </Stack>

                        <Button
                            w="85%"
                            size="lg"
                            color="gray.900"
                            bg="button.cta"
                            m={2}
                            transition="ease-in 0.3s"
                            _hover={{bg: "barber.900", color:"white"}}
                            disabled={!subscription}
                            onClick={handleUpdateHaircut}
                        >
                            Cadastrar
                        </Button>

                        {!subscription && (
                            <Flex color="white" direction="column" align="center" mt={4}>
                                <Text>
                                    Você não pode editar.
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
    const { id } = ctx.params

    try{
        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get('/haircut/check')
        const responseId = await apiClient.get('/haircut/detail', {
            params:{
                haircut_id:id
            }
        })

        return{
            props:{
                subscription: response.data?.subscriptions?.status === 'active' ? true : false,
                haircut: responseId.data
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