import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import StudentApi from '../Api/StudentApi';
import User from '../types/user';
import store from '../store/store';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface StudentRow {
  id: number;
  name: string;
  instrument: string;
  modality: string;
  duration: number;
  price: number;
}

const Home: NextPage = () => {
  const [user, setUser] = useState<User>(store.getState());
  const [students, setStudents] = useState<StudentRow[]>([]);
  store.subscribe(() => {
    setUser(store.getState());
  });

  useEffect(() => {
    if (!user.token) {
      return;
    }
    StudentApi.getAll().then(res => {
      setStudents(res.map(s => ({
        id: s.id as number,
        name: s.name,
        instrument: s.instrument.instrument,
        modality: s.classFormat.modality,
        duration: +s.classFormat.timeMinutes,
        price: +s.classFormat.price
      })));
    });
  }, []);

  return (
    <main className='mt-12 text-center font-bold text-4xl'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Instrumento</TableCell>
            <TableCell>Modalidade</TableCell>
            <TableCell>Duração</TableCell>
            <TableCell>Preço</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.instrument}</TableCell>
              <TableCell>{s.modality}</TableCell>
              <TableCell>{s.duration}</TableCell>
              <TableCell>{s.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Home;
