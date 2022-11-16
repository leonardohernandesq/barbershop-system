import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import {
    Flex,
    Text,
    Button,
    Heading,
    Link as ChakraLink,
    useMediaQuery,
    useDisclosure
} from '@chakra-ui/react'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { setupAPIClient } from '../../services/api';
import { Sidebar } from '../../components/sidebar';
import { useState } from 'react';
import { ModalInfo } from '../../components/modal';

export interface IScheduleItem{
    id: string;
    customer: string;
    haircut:{
        id:string;
        name:string;
        price: string | number;
        user_id: string;
    };
}

interface IDashboardProps{
    schedule: IScheduleItem[]
}

export default function Dashboard({schedule}: IDashboardProps){
    const [isMobile] = useMediaQuery("(max-width:500px)")
    const [scheduleList, setScheduleList] = useState(schedule);
    const [service, setService] = useState<IScheduleItem>();
    const { isOpen, onOpen, onClose } = useDisclosure();

    function handleOpenModal(item: IScheduleItem){
        setService(item);
        onOpen();
    }

    async function handleFinishService(id: string){
        try{
            const apiClient = setupAPIClient();
            await apiClient.delete('/schedule',{
                params:{
                    schedule_id: id
                }
            })
            // renova a lista sem fazer outra requisição
            const filterItem = scheduleList.filter(item => {
                return (item?.id !== id)
            })

            setScheduleList(filterItem)
            onClose();
        } catch(err){
            console.log(err)
            onClose()
            alert("Erro ao fechar o Modal")
        }
    }

    return(
        <>
        <Head>
            <title>BarberPRO - Minha Barbearia</title>
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
                        <Heading
                        color="orange.900"
                        size="lg"
                        mr={4}
                        >
                            Agenda
                        </Heading>

                        <Link href="/new">
                            <Button
                                bg="barber.400"
                                p={4}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mr={3}
                                _hover={{bg:'barber.400'}}
                            >
                                <FiCalendar color="orange" size={20} />
                                <Text color="white" ml={2}>Registrar</Text>
                            </Button>
                        </Link>
                    </Flex>

                    {
                        scheduleList.map(item => (
                            <ChakraLink
                                key={item?.id}
                                w="98%"
                                m={0}
                                p={0}
                                mt={1}
                                bg="transparent"
                                onClick={() => handleOpenModal(item)}
                            >
                                <Flex
                                w="100%"
                                direction={isMobile ? "column" : "row"}
                                p={4}
                                rounded={4}
                                mb={2}
                                bg="barber.400"
                                justify="space-between"
                                >
                                    <Flex direction="row" align="center" justify="flex-start" w="33%">
                                        <FiUser size={28} color="#fba931"/>
                                        <Text ml={4} color="#f1f1f1">{item?.customer}</Text>
                                    </Flex>

                                    <Flex direction="row" align="center" justify="center" w="33%">
                                        <Text color="white" fontWeight="bold">{item?.haircut?.name}</Text>
                                    </Flex>
                                    <Flex direction="row" align="center" justify="flex-end" w="33%">
                                    <Text color="white" fontWeight="bold">R$ {Number(item?.haircut?.price).toFixed(2)}</Text>
                                    </Flex>
                                </Flex>
                            </ChakraLink>
                        ))
                    }
                </Flex>
        </Sidebar>

        <ModalInfo 
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            data={service}
            finishService={() => handleFinishService(service?.id)}
        />
    </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try{
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/schedule')
        return{
            props:{
                schedule: response.data
            }
        }

    }catch(err){
        console.log(err)
        return{
            props:{
                schedule: []
            }
        }
    }
}) 