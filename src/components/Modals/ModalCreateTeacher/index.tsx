import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';

interface ModalCreateTeacherProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCreateTeacher: React.FC<ModalCreateTeacherProps> = ({ isOpen, onClose }) => {
    const initialFormData = {
        name: '',
        email: '',
        employee_id: ''
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
                return;
            }

            const response = await axios.post('https://marcacao-sala.onrender.com/teacher/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Professor criado com sucesso:', response.data);
            toast({
                title: 'Professor criado com sucesso!',
                description: "O professor foi criado e adicionado ao sistema.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Ocorreu um erro ao criar o professor:', error);
            toast({
                title: 'Erro ao criar professor',
                description: "Houve um problema ao tentar criar o professor.",
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
                <ModalHeader>Adicionar Professor</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input name="name" placeholder="Nome" value={formData.name} onChange={handleInputChange} marginTop="20px" />
                    <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} marginTop="20px" />
                    <Input name="employee_id" placeholder="ID do Funcionário" value={formData.employee_id} onChange={handleInputChange} marginTop="20px" />
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

export default ModalCreateTeacher;
