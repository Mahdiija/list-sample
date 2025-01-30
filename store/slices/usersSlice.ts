import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  age: number;
  email: string;
}

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Single user
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    // Single user delete
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    // NEW: multiple users at once
    addUsers: (state, action: PayloadAction<User[]>) => {
      state.users.push(...action.payload);
    },
  },
});

export const { addUser, addUsers, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;