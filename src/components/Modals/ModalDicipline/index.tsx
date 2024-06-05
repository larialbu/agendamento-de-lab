import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Spinner, Flex, Input, useToast } from '@chakra-ui/react';

interface Discipline {
    id: number;
    name: string;
}

interface DisciplineDetailsProps {
    disciplineId: number | null;
    onClose: () => void;
    onDisciplineUpdated: () => void; // Callback to refresh the list
}

const DisciplineDetails: React.FC<DisciplineDetailsProps> = ({ disciplineId, onClose, onDisciplineUpdated }) => {
    const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();

    useEffect(() => {
        const fetchDiscipline = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                setLoading(true);
                const response = await axios.get(`https://marcacao-sala.onrender.com/subject/${disciplineId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDiscipline(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ocorreu um erro ao buscar detalhes da disciplina:', error);
                setLoading(false);
            }
        };

        if (disciplineId) {
            fetchDiscipline();
        }
    }, [disciplineId]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !discipline) {
                return;
            }

            setLoading(true);
            await axios.put(`https://marcacao-sala.onrender.com/subject/${discipline.id}`, discipline, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);

            onClose();
            onDisciplineUpdated();
            toast({
                title: "Disciplina salva com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ocorreu um erro ao salvar as alterações da disciplina:', error);
            setLoading(false);
            toast({
                title: "Erro ao salvar disciplina!",
                description: "Ocorreu um erro ao salvar as alterações da disciplina. Por favor, tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !discipline) {
                return;
            }

            setLoading(true);
            await axios.delete(`https://marcacao-sala.onrender.com/subject/${discipline.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);

            onClose();
            onDisciplineUpdated();
            toast({
                title: "Disciplina excluída com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ocorreu um erro ao excluir a disciplina:', error);
            setLoading(false);
            toast({
                title: "Erro ao excluir disciplina!",
                description: "Ocorreu um erro ao excluir a disciplina. Por favor, tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDiscipline((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Modal isOpen={!!disciplineId} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalhes da Disciplina</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Flex justify="center" align="center" height="60px">
                            <Spinner size="xl" color="green.500" />
                        </Flex>
                    ) : (
                        discipline ? (
                            <div>
                                <p><strong>Nome:</strong> <Input name="name" value={discipline.name} onChange={handleChange} marginTop="20px" /></p>
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
};

export default DisciplineDetails;
