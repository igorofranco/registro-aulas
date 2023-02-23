import { createSlice } from '@reduxjs/toolkit';
import Student from '../../types/student';

export const studentsSlice = createSlice({
  name: 'students',
  initialState: [] as Student[],
  reducers: {
    addStudent (studentsState: Student[], student: {payload: Student, type: string}) {
      studentsState.push(student.payload);
      return studentsState;
    },
    setStudents (studentsState: Student[], students: {payload: Student[], type: string}) {
      return students.payload;
    }
  }
});
