import React from 'react';
import './NotFoundPage.css';
import notFoundImage from '../../assets/pikachu-i-choose-you-sad-icon-png-icon-removebg-preview.png';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const navigateSearch = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <img src={notFoundImage} alt="Not Found" />
      <h1>Page is not found</h1>
      <button onClick={navigateSearch}>Go back to search</button>
    </div>
  );
};

export default NotFoundPage;
