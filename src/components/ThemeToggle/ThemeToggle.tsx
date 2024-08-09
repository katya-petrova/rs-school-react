import React, { useContext, useEffect } from 'react';
import './ThemeToggle.scss';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  return (
    <div className="wrapper">
      <div className="toggle">
        <input
          className="toggle-input"
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light');
          }}
        />
        <div className="toggle-bg"></div>
        <div className="toggle-switch">
          <div className="toggle-switch-figure"></div>
          <div className="toggle-switch-figureAlt"></div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
