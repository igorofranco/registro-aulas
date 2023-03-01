import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Autocomplete,
  Button,
  DialogTitle,
  Fab,
  IconButton,
  MenuItem,
  Select,
  TextField,
  useMediaQuery
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import FormatDialog from './FormatDialog';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import Instrument from '../types/instrument';
import ClassFormat from '../types/classFormat';
import { instrumentsStore } from '../store/instrumentsStore';
import { classFormatsStore } from '../store/classFormatsStore';
import InstrumentApi from '../Api/InstrumentApi';
import ClassFormatApi from '../Api/ClassFormatApi';
import { instrumentsSlice } from '../features/instruments/instrumentsSlice';
import { classFormatsSlice } from '../features/classFormats/classFormatsSlice';
import Student from '../types/student';
import User from '../types/user';
import { useTheme } from '@mui/system';
import StudentApi, { StudentForApi } from '../Api/StudentApi';
import studentsStore from '../store/studentsStore';
import { studentsSlice } from '../features/student/studentsSlice';
import userStore from '../store/userStore';

interface StudentDialogProps {
  open: boolean;
  onClose: () => void;
}

function getFormatLabel (format: ClassFormat): string {
  return `${format.modality} - R$ ${format.price / 100},00 - ${format.timeMinutes}min`;
}

function getUser (): User {
  return { id: 1, name: '', email: '' };
}

function createStudent (): Student {
  return {
    name: '',
    instrument: { instrument: '' },
    classFormat: { timeMinutes: 0, modality: '', price: 0, user: getUser() },
    user: getUser()
  };
}

const daysOfWeek = [
  'SUNDAY', 'MONDAY',
  'TUESDAY', 'WEDNESDAY',
  'THURSDAY', 'FRIDAY',
  'SATURDAY'
];

const StudentDialog = (props: StudentDialogProps) => {
  const [student, setStudent] = React.useState<Student>(createStudent());
  const [user, setUser] = React.useState<User>(userStore.getState());
  const [loading, setLoading] = React.useState<boolean>(true);
  const [formatDialogOpen, setFormatDialogOpen] = React.useState<boolean>(false);
  const [instruments, setInstruments] = React.useState<Instrument[]>([]);
  const [formats, setFormats] = React.useState<ClassFormat[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  userStore.subscribe(() => {
    setUser(userStore.getState());
  });
  instrumentsStore.subscribe(() => {
    setInstruments(instrumentsStore.getState());
  });
  classFormatsStore.subscribe(() => {
    setFormats(classFormatsStore.getState());
  });

  React.useEffect(() => {
    if (formats.length && instruments.length) { return; }
    setLoading(true);
    Promise.all([
      InstrumentApi.getAll(),
      ClassFormatApi.getAll()
    ]).then(res => {
      instrumentsStore.dispatch(instrumentsSlice.actions.setInstruments(res[0]));
      classFormatsStore.dispatch(classFormatsSlice.actions.setClassFormats(res[1]));
    }).then(() => {
      setLoading(false);
    });
  }, []);

  async function handleSubmitClick (): Promise<void> {
    setLoading(true);
    if (!student.instrument.instrument || !student.classFormat.id || !user.id) {
      setLoading(false);
      return;
    }
    if (!student.instrument.id) {
      student.instrument.id = (await InstrumentApi.create(student.instrument.instrument)).id;
    }
    if (!student.instrument.id) { return; }
    const newStudentForCreate = {
      name: student.name,
      daysOfWeek: student.daysOfWeek,
      instrument: { id: student.instrument.id },
      classFormat: { id: student.classFormat.id },
      user: { id: user.id }
    } as StudentForApi;
    await StudentApi.create(newStudentForCreate)
      .then(() => {
        fetchStudents();
        props.onClose();
      });
    setLoading(false);
  }

  type InstrumentValue = { id: number; label: string; } | string | null;
  function handleInstrumentChange (e: React.SyntheticEvent, newValue: InstrumentValue): void {
    const newInstrument: Instrument = { id: undefined, instrument: '' };

    if (newValue === null) {
      set();
      return;
    }

    if (typeof newValue === 'string' && !instruments.find(i => i.instrument === newValue)) {
      newInstrument.instrument = newValue;
      set();
      return;
    }

    if (typeof newValue !== 'string') {
      newInstrument.id = newValue.id;
      newInstrument.instrument = newValue.label;
      set();
    }

    function set (): void {
      setStudent(student => ({
        ...student,
        instrument: newInstrument
      }));
    }
  }
  function handleFormatChange (formatId: number): void {
    setStudent(prevState => ({
      ...prevState,
      classFormat: { ...prevState.classFormat, id: formatId }
    }));
  }
  function handleDayChange (daysOfWeek: string): void {
    setStudent(prevState => ({
      ...prevState,
      daysOfWeek
    }));
  }
  function handleNameChange (name: string): void {
    setStudent(prevState => ({ ...prevState, name }));
  }

  function fetchStudents (): void {
    setLoading(true);
    StudentApi.getAll()
      .then(res => {
        studentsStore.dispatch(studentsSlice.actions.setStudents(res));
      })
      .then(() => setLoading(false));
  }

  const validate = {
    name (): boolean {
      return student.name.length > 3;
    },
    instrument (): boolean {
      return !!student.instrument.instrument;
    },
    daysOfWeek (): boolean {
      return daysOfWeek.includes(student.daysOfWeek || '');
    },
    format (): boolean {
      return !!student.classFormat.id;
    },
    form (): boolean {
      return this.name() && this.instrument() && this.daysOfWeek() && this.format();
    }
  };

  return (
    <Dialog fullScreen={fullScreen} open={props.open} onClose={props.onClose}>
      <DialogTitle className='flex justify-between'>
        <span>Novo Aluno</span>
        <IconButton className='aspect-square' onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form className='p-5 flex flex-col gap-5' style={{ width: '100%', maxWidth: '600px' }}>
        <TextField
          label='Nome do Aluno'
          autoComplete='off'
          disabled={loading}
          onChange={e => handleNameChange(e.target.value)}
        />
        <Autocomplete
          renderInput={(params) => <TextField {...params} label='Instrumento' />}
          freeSolo
          autoSelect
          disabled={loading}
          onChange={(e, newValue) => { handleInstrumentChange(e, newValue as {id: number;label:string} | string); }}
          options={[...instruments.map(i => ({ ...i, label: i.instrument }))]}
        />
        <Select
          label="Dia"
          value={student.daysOfWeek || '0'}
          disabled={loading}
          onChange={e => handleDayChange(e.target.value)}
        >
          <MenuItem
            key={'day-of-week-dia'}
            value='0'
            disabled
          >
            Dia
          </MenuItem>
          {daysOfWeek.map(day => (
            <MenuItem
              key={`day-of-week-${day}`}
              value={day}
            >
              {day}
            </MenuItem>
          ))}
        </Select>
        <div className='w-full flex items-center gap-5'>
          <Fab
            size='small'
            color='secondary'
            disabled={loading}
            onClick={() => { setFormatDialogOpen(true); }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Fab>
          <Select
            label="Modalidade"
            disabled={loading}
            value={student.classFormat.id || 0}
            onChange={e => handleFormatChange(Number(e.target.value))}
            className="flex-grow"
          >
            <MenuItem
              key={'f-0'}
              value={0}
              disabled
            >
              Modalidade
            </MenuItem>
            {formats.map(f => (
              <MenuItem
                key={`f-${f.id}`}
                value={f.id}
              >
                {getFormatLabel(f)}
              </MenuItem>
            ))}
          </Select>
        </div>
        <Button
          variant='contained' size='large'
          disabled={loading || !validate.form()} onClick={handleSubmitClick}
        >
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faUser} />
            <span>Cadastrar</span>
          </div>
        </Button>
      </form>
      <FormatDialog
        open={formatDialogOpen}
        onClose={() => { setFormatDialogOpen(false); }}
      />
    </Dialog>
  );
};

export default StudentDialog;
