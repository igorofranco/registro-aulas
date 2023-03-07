import * as React from 'react';
import type { NextPage } from 'next';
import StudentApi from '../Api/StudentApi';
import User from '../types/user';
import userStore from '../store/userStore';
import { IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MainSpeedDial from '../components/MainSpeedDial';
import studentsStore from '../store/studentsStore';
import { studentsSlice } from '../features/student/studentsSlice';
import Student from '../types/student';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface StudentRow {
  id: number;
  name: string;
  instrument: string;
  modality: string;
  duration: number;
  price: number;
  student: Student;
}

const daysInEnglish = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURADAY'
];

function studentToRow (student: Student): StudentRow {
  return {
    id: student.id || 0,
    name: student.name,
    instrument: student.instrument?.instrument,
    modality: student.classFormat.modality,
    duration: student.classFormat.timeMinutes,
    price: student.classFormat.price / 100,
    student
  };
}

const Home: NextPage = () => {
  const [user, setUser] = React.useState<User>(userStore.getState());
  const [total, setTotal] = React.useState<number>(0);
  const [students, setStudents] = React.useState<StudentRow[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
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

  function montlyValueByStudent (student: Student): number {
    const date = new Date();
    const selectedMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const numberOfDaysInSelecetdMonth = selectedMonth.getDate();
    let numberOfClasses = 0;
    for (let i = 0; i <= numberOfDaysInSelecetdMonth; i++) {
      selectedMonth.setDate(i);
      if (selectedMonth.getDay() === daysInEnglish.indexOf(student.daysOfWeek.toString())) {
        numberOfClasses++;
      }
    }
    return (numberOfClasses * student.classFormat.price) / 100;
  }

  function getMonthTotal (): number {
    let sum = 0;
    for (const student of students) {
      sum += montlyValueByStudent(student.student);
    }
    return sum;
  }

  if (!userStore.getState().id) {
    return null;
  }

  return (
    <main className='mt-2 flex flex-col items-center justify-center'>
      <Table className='max-w-full overflow-x-auto' sx={{ width: '720px' }}>
        <TableHead>
          <TableRow>
            <TableCell><span className='text-2xl' title='Nome'>🙋</span></TableCell>
            <TableCell><span className='text-2xl' title='Valor da Aula'>💰</span>/mês</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(s => {
            const id = `aluno-${s.id}-${s.name}-${s.instrument}`;
            return (
              <TableRow
                key={id}
              >
                <TableCell>{s.name}</TableCell>
                <TableCell>R$ {montlyValueByStudent(s.student)},00</TableCell>
                <TableCell>
                  <IconButton
                    size='small'
                    onClick={e => setMenuAnchorEl(e.currentTarget)}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </IconButton>
                  <Menu
                    open={!!menuAnchorEl}
                    anchorEl={menuAnchorEl}
                    onClose={() => setMenuAnchorEl(null)}
                  >
                    <MenuItem
                      className='flex gap-2'
                      onClick={() => {
                        StudentApi.delete(s.id)
                          .then(() => fetchStudents());
                        setMenuAnchorEl(null);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="text-red-800"
                      />
                      <span>Deletar</span>
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow key='aluno-total'>
            <TableCell>Total/semana</TableCell>
            <TableCell>R$ {total},00</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total/mês</TableCell>
            <TableCell>R$ {getMonthTotal()},00</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {!isLoading || !user.token ? <MainSpeedDial /> : null}
    </main>
  );
};

export default Home;
