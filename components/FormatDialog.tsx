import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Button, DialogTitle, IconButton, InputAdornment, TextField, useMediaQuery } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import ClassFormatApi, { ClassFormatForApi } from '../Api/ClassFormatApi';
import { ChangeEvent } from 'react';
import { classFormatsStore } from '../store/classFormatsStore';
import { classFormatsSlice } from '../features/classFormats/classFormatsSlice';
import ClassFormat from '../types/classFormat';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { useTheme } from '@mui/system';
import User from '../types/user';
import userStore from '../store/userStore';

interface FormatDialogProps {
  open: boolean;
  onClose: () => void;
}

const FormatDialog = (props: FormatDialogProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User>(userStore.getState());
  const [format, setFormat] = React.useState<ClassFormat>({
    modality: '',
    price: 0.0,
    timeMinutes: 0,
    user: { id: user.id } as User
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  userStore.subscribe(() => {
    setUser(userStore.getState());
  });

  function handleChangeModality (e: ChangeEvent<HTMLInputElement>) {
    setFormat(prevState => ({ ...prevState, modality: e.target.value }));
  }
  function handleChangeDuration (e: ChangeEvent<HTMLInputElement>) {
    setFormat(prevState => ({ ...prevState, timeMinutes: +e.target.value }));
  }
  function handleChangePrice (e: ChangeEvent<HTMLInputElement>) {
    setFormat(prevState => ({ ...prevState, price: +e.target.value * 100 }));
  }
  function handleSubmitClick (): void {
    setLoading(true);
    console.log(user);
    ClassFormatApi.create({ ...format, user: { id: user.id } as User } as unknown as ClassFormatForApi)
      .then(res => {
        classFormatsStore.dispatch(classFormatsSlice.actions.addClassFormat(res));
        props.onClose();
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const validate = {
    modality (): boolean {
      return format.modality.length > 3;
    },
    duration (): boolean {
      return format.timeMinutes > 0;
    },
    price (): boolean {
      return format.price > 0;
    },
    form (): boolean {
      return this.modality() && this.duration() && this.price();
    }
  };

  return (
    <Dialog fullScreen={fullScreen} open={props.open} onClose={props.onClose}>
      <DialogTitle className='flex justify-between'>
          <span>Nova Modalidade de Aula</span>
          <IconButton className='aspect-square' onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
      </DialogTitle>
      <form className='min-w-[420px] max-w-full p-5 flex flex-col gap-5'>
        <TextField
          label='Modalidade' placeholder='Presencial / Remoto'
          autoComplete='off'
          disabled={loading}
          onChange={(e) => { handleChangeModality(e as ChangeEvent<HTMLInputElement>); }}
        />
        <div className='flex gap-5'>
          <TextField
            label="Duração"
            type="number"
            disabled={loading}
            onChange={(e) => { handleChangeDuration(e as ChangeEvent<HTMLInputElement>); }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>min</InputAdornment>
            }}
            inputProps={{
              step: 5,
              min: 0
            }}
            autoComplete="off"
          />
          <TextField
            label="Valor por Aula"
            type="number"
            disabled={loading}
            onChange={(e) => { handleChangePrice(e as ChangeEvent<HTMLInputElement>); }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>R$</InputAdornment>
            }}
            inputProps={{
              step: 5,
              min: 0
            }}
            autoComplete="off"
          />
        </div>
        <Button
          variant='contained' size='large'
          disabled={loading || !validate.form()} onClick={handleSubmitClick}
        >
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faTable} />
            <span>Nova Modalidade</span>
          </div>
        </Button>
      </form>
    </Dialog>
  );
};

export default FormatDialog;
