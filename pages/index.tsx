import * as React from 'react';
import type { NextPage } from 'next';
import StudentApi from '../Api/StudentApi';
import User from '../types/user';
import userStore from '../store/userStore';
import {
  Button,
  Card, CardContent,
  IconButton,
  Menu,
  MenuItem, Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import MainSpeedDial from '../components/MainSpeedDial';
import studentsStore from '../store/studentsStore';
import { studentsSlice } from '../features/student/studentsSlice';
import Student from '../types/student';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrashAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ClassFormatApi from '../Api/ClassFormatApi';
import { classFormatsStore } from '../store/classFormatsStore';
import { classFormatsSlice } from '../features/classFormats/classFormatsSlice';
import ClassFormat from '../types/classFormat';

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

const monthsInPt = [
  'Jan', 'Fev', 'Mar',
  'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set',
  'Out', 'Nov', 'Dez'
];

function rs (value: number): string {
  let v = value.toString();
  v = v.slice(0, v.length - 2) + ',' + v.slice(v.length - 2);
  return `R$ ${v}`;
}

function studentToRow (student: Student): StudentRow {
  return {
    id: student.id || 0,
    name: student.name,
    instrument: student.instrument?.instrument,
    modality: student.classFormat.modality,
    duration: student.classFormat.timeMinutes,
    price: student.classFormat.price,
    student
  };
}

const Home: NextPage = () => {
  const [user, setUser] = React.useState<User>(userStore.getState());
  const [students, setStudents] = React.useState<StudentRow[]>([]);
  const [formats, setFormats] = React.useState<ClassFormat[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [advancedEdition, setAdvancedEdition] = React.useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());

  userStore.subscribe(() => setUser(userStore.getState()));
  studentsStore.subscribe(() => setStudents(studentsStore.getState().map(s => studentToRow(s))));
  classFormatsStore.subscribe(() => setFormats(classFormatsStore.getState()));

  React.useEffect(() => {
    if (!user.token) { return; }
    fetchStudents();
    fetchFormats();
  }, [user]);

  function previousMonth (): void {
    setSelectedMonth(prevState => {
      if (prevState === 1) {
        previousYear();
        return 12;
      }
      return prevState - 1;
    });
  }
  function nextMonth (): void {
    setSelectedMonth(prevState => {
      if (prevState === 12) {
        nextYear();
        return 1;
      }
      return prevState + 1;
    });
  }
  function previousYear (): void {
    setSelectedYear(prevState => prevState - 1);
  }
  function nextYear (): void {
    setSelectedYear(prevState => prevState + 1);
  }
  function resetDate (): void {
    const date = new Date();
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
  }

  function isFormatReadyToBeDeleted (modality: string): boolean {
    return !!students.find(s => s.modality === modality);
  }

  function fetchStudents (): void {
    setLoading(true);
    StudentApi.getAll()
      .then(res => {
        studentsStore.dispatch(studentsSlice.actions.setStudents(res));
      })
      .then(() => setLoading(false));
  }

  function fetchFormats (): void {
    setLoading(true);
    ClassFormatApi.getAll()
      .then(res => classFormatsStore.dispatch(classFormatsSlice.actions.setClassFormats(res)))
      .then(() => setLoading(false));
  }

  function montlyValueByStudent (student: Student): number {
    const month = new Date(selectedYear, selectedMonth, 0);
    const numberOfDaysInSelecetdMonth = month.getDate();
    let numberOfClasses = 0;
    for (let i = 1; i <= numberOfDaysInSelecetdMonth; i++) {
      month.setDate(i);
      if (month.getDay() === daysInEnglish.indexOf(student.daysOfWeek.toString())) {
        numberOfClasses++;
      }
    }
    return (numberOfClasses * student.classFormat.price);
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
    <main className="mt-6 flex flex-col gap-4 items-center justify-center">
      <Card
        className="font-bold text-center text-neutral-800"
        style={{ minWidth: '300px', maxWidth: 'calc(100% - 1.5em)' }}
      >
        <CardContent>
          <div className="mb-3 text-3xl">{rs(getMonthTotal())}</div>
          <div className="flex items-center justify-center gap-2">
            <Button
              size="small"
              variant="outlined"
              onClick={previousMonth}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <span
              className="text-xl select-none hover:cursor-pointer"
              onClick={resetDate}
            >
            {monthsInPt[selectedMonth - 1]}/{selectedYear}
          </span>
            <Button
              size="small"
              variant="outlined"
              onClick={nextMonth}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card style={{ maxWidth: 'calc(100% - 1.5em)' }}>
        <CardContent>
          <Table
            className="max-w-full overflow-x-auto"
            sx={{ width: '720px' }}
          >
            <TableHead>
              <TableRow>
                <TableCell><span
                  className="text-2xl"
                  title="Nome"
                >🙋</span></TableCell>
                <TableCell><span
                  className="text-2xl"
                  title="Valor da Aula"
                >💰</span>/mês</TableCell>
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
                    <TableCell>{rs(montlyValueByStudent(s.student))}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        disabled={isLoading || !user.token}
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
                          className="flex gap-2"
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card style={{ maxWidth: 'calc(100% - 1.5em)' }}>
        <CardContent>
          <Table
            className="max-w-full overflow-x-auto"
            sx={{ width: '720px' }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <span className="text-xl">Modalidade</span>
                </TableCell>
                <TableCell>
                  <span className="text-xl">$/aula</span>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formats.map(f => (
                <TableRow key={`format-table-${f.id}`}>
                  <TableCell>{f.modality}</TableCell>
                  <TableCell>{rs(f.price)}</TableCell>
                  <TableCell>
                    <Button
                      color='error'
                      disabled={!advancedEdition || isFormatReadyToBeDeleted(f.modality)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center">
            <Switch
              checked={advancedEdition}
              onChange={e => setAdvancedEdition(e.target.checked)}
            />
            <span>Edição avançada</span>
          </div>
        </CardContent>
      </Card>
      {!isLoading && user.token ? <MainSpeedDial /> : null}
    </main>
  );
};

export default Home;
