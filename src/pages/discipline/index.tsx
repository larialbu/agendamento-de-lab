import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Flex } from '@chakra-ui/react';
import { Container, TitlePage, Title, ButtonWrapper, Main } from '../../styles/pages/dicipline/style';
import ModalCreateDiscipline from '@/components/Modals/ModalCreateDicipline';
import DisciplineDetails from '@/components/Modals/ModalDicipline';

interface Subject {
    id: number;
    name: string;
}

export default function SubjectManagement() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
    const router = useRouter();

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.get('https://marcacao-sala.vercel.app/subject', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubjects(response.data);
        } catch (error) {
            console.error('Erro ao buscar disciplinas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleOpenModalCreate = () => {
        setIsModalCreateOpen(true);
    };

    const handleCloseModalCreate = () => {
        setIsModalCreateOpen(false);
        fetchSubjects(); // Refresh the list after creating a discipline
    };

    const handleDisciplineClick = (disciplineId: number) => {
        setSelectedDisciplineId(disciplineId);
    };

    const handleCloseDisciplineDetails = () => {
        setSelectedDisciplineId(null);
        fetchSubjects(); // Refresh the list after editing or deleting a discipline
    };

    return (
        <>
            <Head>
                <title>Disciplinas</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Main>
                <Container>
                    <TitlePage>
                        <Title>
                            Gerenciamento de Disciplinas
                        </Title>
                        <ButtonWrapper>
                            <Button bg="#006a12" _hover={{ bg: 'green.500' }} color="white" onClick={handleOpenModalCreate}>+ <span>Adicionar disciplina</span></Button>
                        </ButtonWrapper>
                    </TitlePage>

                    <TableContainer>
                        {loading ? (
                            <Flex justify="center" align="center" height="600px">
                                <Spinner
                                    thickness='10px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    width={150}
                                    height={150}
                                    color='green.500'
                                />
                            </Flex>
                        ) : (
                            <Table variant='simple' colorScheme='green'>
                                <Thead>
                                    <Tr>
                                        <Th>Nome</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {subjects.map(subject => (
                                        <Tr
                                            key={subject.id}
                                            onClick={() => handleDisciplineClick(subject.id)}
                                            style={{ cursor: 'pointer' }}
                                            _hover={{ bg: 'green.100', boxShadow: 'md' }}
                                        >
                                        <Td>{subject.name}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </TableContainer>

                    <ModalCreateDiscipline isOpen={isModalCreateOpen} onClose={handleCloseModalCreate} />
                    <DisciplineDetails disciplineId={selectedDisciplineId} onClose={handleCloseDisciplineDetails} onDisciplineUpdated={fetchSubjects} />
                </Container>
            </Main>
        </>
    );
}

