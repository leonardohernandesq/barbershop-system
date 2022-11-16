
import { ReactNode } from 'react'
import { Drawer,
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    DrawerContent,
    useColorModeValue,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps
} from '@chakra-ui/react'

import {
    FiScissors,
    FiClipboard,
    FiSettings,
    FiMenu
} from 'react-icons/fi'
import { IconType } from 'react-icons'

import Link from 'next/link'

interface ILinkItemsProps{
    name:string;
    icon: IconType;
    route: string;
}

const LinkItems: Array<ILinkItemsProps> = [
    {name: 'Agenda', icon: FiScissors, route: '/dashboard'},
    {name: 'Cortes', icon: FiClipboard, route: '/haircuts'},
    {name: 'Minha Conta', icon: FiSettings, route: '/profile'},
]

export function Sidebar({children}: {children: ReactNode}){

    const {isOpen, onOpen, onClose} = useDisclosure();

    return(
        <Box minH="100vh" bg="barber.900">
            <SidebarContent 
                onClose={() => onClose}
                display={{base:'none', md: 'block'}}
            />

            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
                onClose={onClose}
            >
                <DrawerContent>
                    <SidebarContent onClose={() => onClose()} />
                </DrawerContent>
            </Drawer>

            <MobileNav display={{base: 'flex', md: 'none'}} onOpen={onOpen}/>

            <Box ml={{base: 0, md:60}} p={4}>
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps{
    onClose: () => void;
}

const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
    return(
        <Box
            bg="barber.400"
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.700', 'gray.200')}
            w={{base:'full', md: 60}}
            pos="fixed"
            h="full"
            {...rest}
        >

            <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
                <Link href="/dashboard">
                    <Flex cursor="pointer" userSelect="none" flexDirection="row">
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Barber</Text>
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="orange.900">PRO</Text>
                    </Flex>
                </Link>
                <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose} color='white'/>
            </Flex>

            {LinkItems.map(link =>(
                <NavItem icon={link.icon} route={link.route} key={link.name}>
                    {link.name}
                </NavItem>
            ))}

        </Box>
    )
}

interface INavItemProps extends FlexProps{
    icon: IconType;
    children: ReactNode;
    route:string;
}

const NavItem = ({icon, children, route, ...rest}: INavItemProps) => {
    return(
        <Link href={route} style={{textDecoration: 'none'}}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                color="barber.100"
                transition='all 0.5s'
                _hover={{
                    bg: "barber.900",
                    color: "white"
                }}
            >
            {icon && (
                <Icon 
                    mr={4}
                    fontSize="16"
                    color="barber.100"
                    as={icon}
                    transition='all 0.5s'
                    _groupHover={{
                        color: 'white'
                    }}
                />
            )}
            {children}

        </Flex>
    </Link>
    )
}

interface IMobileProps extends FlexProps{
    onOpen: () => void;
}

const MobileNav = ({onOpen, ...rest}: IMobileProps) => {
    return(
        <Flex
            ml={{base: 0, md: 60}}
            px={{base: 4, md: 24}}
            height="20"
            alignItems='center'
            bg='barber.400'
            borderBottomColor='gray.700'
            justifyContent="space-between"
            {...rest}
        >
            <IconButton 
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={ <FiMenu />}
                color='gray.300'
                borderColor='gray.300'
                _hover={{
                    bg: "white",
                    color: "barber.900"
                }}
            />

            <Link href="/dashboard" >
                <Flex cursor="pointer" userSelect="none" flexDirection="row" pr={2}>
                    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Barber</Text>
                    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="orange.900">PRO</Text>
                </Flex>
            </Link>

        </Flex>
    )
}