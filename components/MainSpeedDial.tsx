import * as React from 'react';
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGuitar, faPlus, faTable, faUser } from '@fortawesome/free-solid-svg-icons';
import StudentDialog from './StudentDialog';
import FormatDialog from './FormatDialog';

type SelectedDialog = 'Aluno' | 'Formato de Aula' | 'Instrumento' | null;

interface Action {
  name: SelectedDialog;
  icon: React.ReactElement;
  dialog: React.ReactElement;
}

const MainSpeedDial: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedDialog, setSelectedDialog] = React.useState<SelectedDialog>(null);
  function handleOpen (): void { setOpen(true); }
  function handleClose (): void { setOpen(false); }
  const handleCloseDialog = () => setSelectedDialog(null);

  function isDialogOpened (dialog: SelectedDialog): boolean {
    return selectedDialog === dialog;
  }

  const actions: Action[] = [
    {
      name: 'Aluno',
      icon: <FontAwesomeIcon icon={faUser} />,
      dialog: <StudentDialog open={isDialogOpened('Aluno')} onClose={handleCloseDialog} />
    },
    {
      name: 'Formato de Aula',
      icon: <FontAwesomeIcon icon={faTable} />,
      dialog: <FormatDialog open={isDialogOpened('Formato de Aula')} onClose={handleCloseDialog} />
    },
    {
      name: 'Instrumento',
      icon: <FontAwesomeIcon icon={faGuitar} />,
      dialog: <StudentDialog open={isDialogOpened('Instrumento')} onClose={handleCloseDialog} />
    }
  ];

  return (
    <Box>
      <SpeedDial
        ariaLabel=''
        sx={{ position: 'absolute', bottom: 24, right: 24 }}
        icon={<FontAwesomeIcon icon={faPlus} />}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        {actions.map(a => (
          <SpeedDialAction
            key={a.name}
            icon={a.icon}
            tooltipTitle={a.name}
            sx={{ height: 'inherit' }}
            onClick={() => { setSelectedDialog(a.name); setOpen(false); }}
          />
        ))}
      </SpeedDial>
      {actions.find(a => a.name === selectedDialog)?.dialog}
    </Box>
  );
};

export default MainSpeedDial;
