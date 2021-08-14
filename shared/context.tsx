import { createContext } from 'react';
import { UserFull } from '../model/server.model';

const initUser: UserFull = { user: null, username: null };

export const UserContext = createContext(initUser);
