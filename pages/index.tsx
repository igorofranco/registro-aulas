import * as React from 'react';
import type { NextPage } from 'next';
import StudentApi from '../Api/StudentApi';
import User from '../types/user';
import userStore from '../store/userStore';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MainSpeedDial from '../components/MainSpeedDial';
import studentsStore from '../store/studentsStore';
import { studentsSlice } from '../features/student/studentsSlice';
import Student from '../types/student';

interface StudentRow {
  id: number;
  name: string;
  instrument: string;
  modality: string;
  duration: number;
  price: number;
}

function studentToRow (student: Student): StudentRow {
  return {
    id: student.id || 0,
    name: student.name,
    instrument: student.instrument?.instrument,
    modality: student.classFormat.modality,
    duration: student.classFormat.timeMinutes,
    price: student.classFormat.price / 100
  };
}

const Home: NextPage = () => {
  const [user, setUser] = React.useState<User>(userStore.getState());
  const [total, setTotal] = React.useState<number>(0);
  const [students, setStudents] = React.useState<StudentRow[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  userStore.subscribe(() => {
    setUser(userStore.getState());
  });
  studentsStore.subscribe(() => {
    setStudents(studentsStore.getState().map(s => studentToRow(s)));
  });

  React.useEffect(() => {
    if (!user.token) { return; }
    fetchStudents();
  }, []);

  React.useEffect(() => {
    let newTotal = 0;
    for (const student of students) {
      newTotal += student.price;
    }
    setTotal(newTotal);
  }, [students]);

  function fetchStudents (): void {
    setLoading(true);
    StudentApi.getAll()
      .then(res => {
        studentsStore.dispatch(studentsSlice.actions.setStudents(res));
      })
      .then(() => setLoading(false));
  }

  return (
    <main className='mt-2 flex flex-col items-center justify-center'>
      <Table className='w-[720px] max-w-full overflow-x-auto'>
        <TableHead>
          <TableRow>
            <TableCell><span className='text-2xl' title='Nome'>🙋</span></TableCell>
            <TableCell><span className='text-2xl' title='Instrumento'>🎻</span></TableCell>
            <TableCell><span className='text-2xl' title='Modalidade'>📋</span></TableCell>
            <TableCell><span className='text-2xl' title='Duração'>🕤</span></TableCell>
            <TableCell><span className='text-2xl' title='Valor da Aula'>💰</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(s => (
            <TableRow key={`aluno-${s.id}-${s.name}-${s.instrument}`}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.instrument}</TableCell>
              <TableCell>{s.modality}</TableCell>
              <TableCell>{s.duration} min</TableCell>
              <TableCell>R$ {s.price},00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <section className='mt-3 font-bold'>
        TOTAL/semana: R$ {total},00
      </section>
      {!isLoading || !user.token ? <MainSpeedDial /> : null}
    </main>
  );
};

export default Home;
