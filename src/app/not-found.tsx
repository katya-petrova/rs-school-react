import React from 'react';
import './not-found.css';
import notFoundImage from '../assets/pikachu-i-choose-you-sad-icon-png-icon-removebg-preview.png';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container">
      <img src={notFoundImage.src} alt="Not Found" />
      <h1>Page is not found</h1>
    </div>
  );
};

export default NotFoundPage;
