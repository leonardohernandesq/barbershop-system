import Head from "next/head";
import Link from "next/link";
import { getStripeJs } from '../../services/stripe-js'

import {
    Button,
    Flex,
    Heading,
    Text,
    useMediaQuery
} from '@chakra-ui/react'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";

interface IPremiumProps{
    premium: boolean
}

export default function Planos({premium}: IPremiumProps){
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const handleSubscribe = async () => {
        if(premium){
            return;
        }

        try{    
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/subscribe')
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({sessionId: sessionId})

        } catch(err){
            console.log(err);
        }
    }

    async function handleCreatePortal(){
        
        try{
            if(!premium){
                return;
            }

            const apiClient = setupAPIClient();
            const response = await apiClient.post('/create-portal')

            const { sessionId } = response.data;

            window.location.href = sessionId;
        } catch(err){
            console.log(err.message);
        }

    }

    return(
        <>
            <Head>
                <title>BarberPRO - Sua assinatura premium</title>
            </Head>
            <Sidebar>
                <Flex color="white" w="100%" direction="column" align="flex-start" justify="flex-start">
                    <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
                        Planos
                    </Heading>
                </Flex>

                <Flex pb={8} maxW="780px" w="100%" align="flex-start" justify="flex-start">
                    <Flex w="100%" gap={4} flexDirection={isMobile ? "column" : "row" }>
                        <Flex color="white" rounded={4} p={4} flex={1} bg="barber.400" flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2} mb={4}
                            >
                                Plano Grátis
                            </Heading>

                            <Text fontWeight="medium" ml={4} mb={2}>- Registrar Cortes</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Criar apenas 3 modelos de cortes</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Editar Dados do perfil</Text>
                        </Flex>

                        <Flex color="white" rounded={4} p={4} flex={1} bg="barber.400" flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2} mb={4}
                                color="orange.900"
                            >
                                Plano Premium
                            </Heading>

                            <Text fontWeight="medium" ml={4} mb={2}>- Registrar Cortes ilimitados</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Criar modelos ilimitados de cortes</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Editar modelos de corte</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Desativar modelos de corte</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Editar Dados do perfil</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>- Receber todas atualizações</Text>

                            <Text fontSize="lg" pt={4} color="red.500" ml={4}>De <s>R$ 19.99</s></Text>
                            <Text fontSize="3xl" fontWeight="bold" ml={4} mb={2} color="#31db6a">Por R$ 9.99</Text>
                            <Button
                            bg={premium ? 'transparent' : 'button.cta'}
                            m={2}
                            ml={4} mr={4}
                            color={premium ? "white" : "barber.400"}
                            onClick={handleSubscribe}
                            disabled={premium}
                            _hover={{
                                bg:"",
                            }}
                            >
                                {premium ? (
                                    "Você já é Premium"
                                ) : (
                                    "Virar Premium"
                                )}
                            </Button>

                            {premium && (
                                <Button
                                    bg="white"
                                    m={2}
                                    ml={4} mr={4}
                                    color="barber.900"
                                    onClick={handleCreatePortal}
                                    _hover={{
                                        bg:"barber.900",
                                        color: "orange.900"
                                    }}
                                >
                                    Alterar Assinatura
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    
    try{
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me')

        return{
            props:{
                premium: response.data?.subscriptions?.status === 'active' ? true : false
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