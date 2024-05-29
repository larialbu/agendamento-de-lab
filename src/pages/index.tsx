import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FormContainer, ScheduleListContainer, Container, Main } from '@/styles/pages/dicipline/style';
import { Heading, VStack, HStack, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, Input, FormControl, Select } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'; // Import delete icon

interface Teacher {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  teacher: Teacher;
  subject: Subject;
  start_time: string;
  end_time: string;
}

const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    teacher_id: '',
    subject_id: '',
    start_time: '',
    end_time: '',
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token de autorização não encontrado.');
          return;
        }
        const response = await axios.get<Teacher[]>('https://marcacao-sala.vercel.app/teacher', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(response.data);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token de autorização não encontrado.');
          return;
        }
        const response = await axios.get<Subject[]>('https://marcacao-sala.vercel.app/subject', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
      }
    };

    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token de autorização não encontrado.');
          return;
        }
        const response = await axios.get<Schedule[]>('https://marcacao-sala.vercel.app/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedules(response.data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
    fetchSubjects();
    fetchSchedules();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autorização não encontrado.');
      }
      // Verificando se todos os campos do formulário estão preenchidos
      if (!formData.teacher_id || !formData.subject_id || !formData.start_time || !formData.end_time) {
        throw new Error('Todos os campos devem ser preenchidos.');
      }
      // Enviando solicitação para agendar um horário
      const response = await axios.post<Schedule>('https://marcacao-sala.vercel.app/schedule', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Verificando se a resposta do servidor foi bem-sucedida
      if (response.status === 200) {
        setSchedules([...schedules, response.data]);
        setFormData({
          teacher_id: '',
          subject_id: '',
          start_time: '',
          end_time: '',
        });
      } else {
        throw new Error('Erro ao agendar horário. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao agendar horário:', error);
      // Adicione lógica para exibir uma mensagem de erro ao usuário, se necessário
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token de autorização não encontrado.');
        return;
      }
      await axios.delete(`https://marcacao-sala.vercel.app/schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Removendo o agendamento da lista localmente após a exclusão bem-sucedida
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Agendamento</title>
        <meta name="description" content="Gerado pelo aplicativo Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Container>
          <Heading as="h1" size="lg" textAlign="center" mb="6">
            Gerenciamento de Agendamentos
          </Heading>
          <HStack spacing="4" mb="6" alignItems="start">
            <FormContainer onSubmit={handleSubmit}>
              <VStack spacing="4">
                <FormControl>
                  <Select name="teacher_id" placeholder="Selecione o Professor" value={formData.teacher_id} onChange={handleChange} required>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Select name="subject_id" placeholder="Selecione a Disciplina" value={formData.subject_id} onChange={handleChange} required>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
                </FormControl>
                <FormControl>
                  <Input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required />
                </FormControl>
                <Button type="submit" colorScheme="green">Agendar</Button>
              </VStack>
            </FormContainer>
            <ScheduleListContainer>
              <Text as="h2" fontSize="xl" mb="4">Lista de Agendamentos</Text>
              {loading ? (
                <Spinner color="green.500" />
              ) : (
                <Table variant="simple" colorScheme="green">
                  <Thead>
                    <Tr>
                      <Th>Professor</Th>
                      <Th>Disciplina</Th>
                      <Th>Hora de Início</Th>
                      <Th>Hora de Término</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {schedules.map((schedule) => (
                      <Tr key={schedule.id}>
                        <Td>{schedule.teacher.name}</Td>
                        <Td>{schedule.subject.name}</Td>
                        <Td>{formatDateTime(schedule.start_time)}</Td>
                        <Td>{formatDateTime(schedule.end_time)}</Td>
                        <Td>
                          <Button colorScheme="red" onClick={() => handleDelete(schedule.id)}>Excluir</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </ScheduleListContainer>
          </HStack>
        </Container>
      </Main>
    </>
  );
};

export default ScheduleManagement;
