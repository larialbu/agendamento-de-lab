import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';

interface ModalCreateDisciplineProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCreateDiscipline: React.FC<ModalCreateDisciplineProps> = ({ isOpen, onClose }) => {
    const initialFormData = {
        name: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.post('https://marcacao-sala.vercel.app/subject/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Disciplina criada com sucesso:', response.data);
            toast({
                title: 'Disciplina criada com sucesso!',
                description: "A disciplina foi criada e adicionada ao sistema.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Ocorreu um erro ao criar a disciplina:', error);
            toast({
                title: 'Erro ao criar disciplina',
                description: "Houve um problema ao tentar criar a disciplina.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Adicionar Disciplina</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={handleInputChange}
                        marginTop="20px"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button colorScheme="green" onClick={handleSubmit} isLoading={loading}>
                        {loading ? <Spinner size="sm" color="red" /> : "Adicionar"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateDiscipline;
