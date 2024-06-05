import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Spinner, Flex, Input, useToast } from '@chakra-ui/react';

interface TeacherModalProps {
    isOpen: boolean;
    teacherId: number | null; // ID do professor selecionado
    onClose: () => void; // Função para fechar o modal
}

const TeacherModal: React.FC<TeacherModalProps> = ({ isOpen, teacherId, onClose }) => {
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast(); // Usado para exibir o alerta

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || !teacherId) {
                    return;
                }

                setLoading(true);
                const response = await axios.get(`https://marcacao-sala.onrender.com/teacher/${teacherId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTeacher(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ocorreu um erro ao buscar detalhes do professor:', error);
                setLoading(false);
            }
        };

        if (isOpen && teacherId) {
            fetchTeacher();
        }
    }, [isOpen, teacherId]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !teacher) {
                return;
            }

            setLoading(true);
            await axios.put(`https://marcacao-sala.onrender.com/teacher/${teacher.id}`, teacher, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);
            toast({
                title: 'Professor atualizado com sucesso!',
                description: "As alterações do professor foram salvas.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            onClose();
        } catch (error) {
            console.error('Ocorreu um erro ao salvar as alterações do professor:', error);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !teacher) {
                return;
            }

            setLoading(true);
            await axios.delete(`https://marcacao-sala.onrender.com/teacher/${teacher.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);
            toast({
                title: 'Professor excluído com sucesso!',
                description: "O professor foi removido do sistema.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            onClose();
        } catch (error) {
            console.error('Ocorreu um erro ao excluir o professor:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTeacher((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalhes do Professor</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Flex justify="center" align="center" height="60px">
                            <Spinner size="xl" color="red.500" />
                        </Flex>
                    ) : (
                        teacher ? (
                            <div>
                                <p><strong>Nome:</strong> <Input name="name" value={teacher.name} onChange={handleInputChange} marginTop="20px" /></p>
                                <p><strong>Email:</strong> <Input name="email" value={teacher.email} onChange={handleInputChange} marginTop="20px" /></p>
                                <p><strong>ID do Funcionário:</strong> <Input name="employee_id" value={teacher.employee_id} onChange={handleInputChange} marginTop="20px" /></p>
                            </div>
                        ) : (
                            <p>Erro ao carregar</p>
                        )
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='yellow' mr={3} onClick={onClose}>
                        Fechar
                    </Button>
                    <Button colorScheme='red' mr={3} onClick={handleDelete}>
                        Excluir
                    </Button>
                    <Button colorScheme='green' mr={3} onClick={handleSave}>
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default TeacherModal;
