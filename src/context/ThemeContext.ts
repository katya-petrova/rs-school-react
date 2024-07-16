import { createContext, Dispatch, SetStateAction } from 'react';

interface IThemeContext {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}

export const ThemeContext = createContext<IThemeContext>({} as IThemeContext);
