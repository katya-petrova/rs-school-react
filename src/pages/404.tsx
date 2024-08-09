import React from 'react';
import './404.css';
import notFoundImage from '../assets/pikachu-i-choose-you-sad-icon-png-icon-removebg-preview.png';
import { useRouter } from 'next/router';

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const navigateSearch = () => {
    router.push('/');
  };

  return (
    <div className="container">
      <img src={notFoundImage.src} alt="Not Found" />
      <h1>Page is not found</h1>
      <button onClick={navigateSearch}>Go back to search</button>
    </div>
  );
};

export default NotFoundPage;
