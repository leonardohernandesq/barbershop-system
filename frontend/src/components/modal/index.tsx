
import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex
} from '@chakra-ui/react'

import { FiUser, FiScissors } from 'react-icons/fi'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { IScheduleItem } from '../../pages/dashboard';

interface ModalInfoProps{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: IScheduleItem;
    finishService: () => Promise<void>;
}

export function ModalInfo({isOpen, onOpen, onClose, data, finishService}: ModalInfoProps){
    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg="barber.400" color="white">
                <ModalHeader>Próximo</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Flex align="center" pb={3} pt={3} borderBottom={'1px solid #ffb13e'}>
                        <FiUser size={28} color="#ffb13e"/>
                        <Text ml={3} fontSize="xl" fontWeight={"bold"}>{data?.customer}</Text>
                        
                    </Flex>

                    <Flex align="center" pb={3} pt={3} borderBottom={'1px solid #ffb13e'}>
                        <FiScissors size={28} color="#ffb13e"/>
                        <Text ml={3} fontSize="xl" fontWeight={"bold"}>{data?.haircut?.name}</Text>
                    </Flex>

                    <Flex align="center" pb={3} pt={3}>
                        <FaMoneyBillAlt size={28} color="#ffb13e"/>
                        <Text ml={3} fontSize="xl" fontWeight={"bold"}>{ Number(data?.haircut?.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</Text>
                    </Flex>
                    <ModalFooter pr={0} mt={3}>
                        <Button
                            bg={'orange.900'}
                            color="barber.400"
                            _hover={{bg: '#ffb13e'}}
                            onClick={() => finishService()}
                        >
                            Finalizar Serviço
                        </Button>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}