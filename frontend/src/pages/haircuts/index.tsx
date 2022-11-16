import { useState, ChangeEvent } from "react";

import Head from "next/head";
import Link from 'next/link';
import { Sidebar } from "../../components/sidebar";
import {
    Flex, 
    Text,
    Heading,
    Button,
    Stack,
    Switch,
    useMediaQuery
} from '@chakra-ui/react'
import { IoMdPricetag } from 'react-icons/io'

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";

interface IHaircutsItem{
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;
}

interface IHaircutsProps{
    haircuts: IHaircutsItem[];
}

export default function Haircuts({haircuts}: IHaircutsProps){

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [haircutList, setHaircutList] = useState<IHaircutsItem[]>(haircuts || [])
    const [valueSwitch, setValueSwitch] = useState("enabled");

    async function handleChangeStatus(e: ChangeEvent<HTMLInputElement>){
        const apiClient = setupAPIClient();

        if(valueSwitch === "enabled"){
            setValueSwitch("disabled")
            
            const response = await apiClient.get('haircuts', {
                params:{
                    status: false
                }
            })

            setHaircutList(response.data);
        } else{
            setValueSwitch("enabled")
            
            const response = await apiClient.get('haircuts', {
                params:{
                    status: true
                }
            })

            setHaircutList(response.data);
        }

        
    }

    return(
        <>
            <Head>
                <title>Serviços - BarberPRO</title>
            </Head>

            <Sidebar>
                <Flex direction="column" mb={4} alignItems="flex-start" justifyContent="flex-start" mr={4}>
                    <Flex
                        direction={isMobile ? 'column' : 'row'}
                        w="100%"
                        alignItems={isMobile ? "flex-start" : "center"}
                        justifyContent="flex-start"
                        mb={0}
                    >
                        <Heading
                            fontSize="3xl"
                            mt={4}
                            mb={4}
                            mr={3}
                            color="orange.900"
                        >
                            Modelos de Corte
                        </Heading>
                        <Link href="/haircuts/new">
                            <Button
                                bg="barber.400"
                                color="white"
                                mr={1}
                                _hover={{bg: "barber.400"}}
                            >
                                Cadastrar Novo
                            </Button>
                        </Link>

                        <Stack ml={isMobile ? 1: "auto"} mt={isMobile ? 3 : 0} align="center" direction="row">
                            <Text color="white" fontWeight="bold">{valueSwitch === 'disabled' ? 'Inativos' : 'Ativos' }</Text>
                            <Switch 
                                colorScheme="green"
                                size="lg"
                                value={valueSwitch}
                                onChange={(e:ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}
                                isChecked={valueSwitch === 'disabled' ? false : true}
                            />
                        </Stack>

                    </Flex>
                </Flex>

                {
                    haircutList.map(haircut => (
                        <Link key={haircut.id} href={`/haircuts/${haircut.id}`}>
                            <Flex
                                cursor="pointer"
                                p={4}
                                bg="barber.400"
                                direction="row"
                                rounded="4"
                                mb={3}
                                mr={4}
                                alignItems="flex-start"
                                justifyContent="space-between"
                            >
                                <Flex direction="row" alignItems="center" justifyContent="center">
                                    <IoMdPricetag size={26} color="#fba931"/>
                                    <Text fontWeight="bold" ml={3} noOfLines={2} color="white">
                                        {haircut.name}
                                    </Text>
                                </Flex>

                                <Text fontWeight="" color="white">Preço: R${Number(haircut.price).toFixed(2)}</Text>

                            </Flex>
                        </Link>
                    ))
                }
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try{

        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircuts', {
            params:{
                status:true
            }
        })

        if(response.data === null){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return{
            props:{
                haircuts: response.data
            }
        }

        
    }catch(err){
        console.log(err)
        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})