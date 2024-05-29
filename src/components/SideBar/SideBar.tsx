import React from 'react';
import { useRouter } from 'next/router';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
    Icon
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'; 
import { Header, IconExit, Text } from "../SideBar/styles";


export function SideBar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const navigation = useRouter();

    const superAdmin =    [
        { label: "Agendamento", path: "/" },
        { label: "Professores", path: "/teacher" },
        { label: "Diciplinas", path: "/discipline" },
    ];

    const handleLogout = () => {
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expiration');
            localStorage.removeItem('permission');
            navigation.push('/login');
        } catch (error) {
            console.error("logout error", error);
        }
    };


    return (
        <>
            <Button ref={btnRef} colorScheme='green' bg='green' onClick={onOpen}>
                <Icon as={HamburgerIcon} color='#fff' />
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    style={{
                        borderRadius: '10px',
                        margin: '10px'
                    }}>
                    <IconExit>
                        <DrawerCloseButton />
                    </IconExit>
                    <DrawerBody>
                        {superAdmin.map((item, index) => (
                            <Text
                                key={index}
                                color="#404040"
                                className="text"
                                onClick={() => {
                                    navigation.push(item.path), onClose();
                                }}
                            >
                                {item.label}
                            </Text>
                        ))}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            variant="solid"
                            bg="#006a12" _hover={{ bg: 'green.500' }} color="white"
                            mt={16}
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </DrawerFooter>

                </DrawerContent>
            </Drawer>
        </>
    )
}
