import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../../context/ThemeContext';

afterEach(cleanup);

describe('ThemeToggle', () => {
  it('changes theme to dark when the toggle is checked and to light when unchecked', () => {
    const setTheme = jest.fn();
    const { getByRole } = render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );

    const checkbox = getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(setTheme).toHaveBeenCalledWith('dark');

    setTheme.mockClear();

    fireEvent.click(checkbox);
    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
