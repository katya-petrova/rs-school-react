import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function usePagination(defaultPage = 0) {
  const location = useLocation();
  const navigate = useNavigate();

  const getNewPage = () => {
    const rawPage = new URLSearchParams(location.search).get('page');
    return rawPage ? parseInt(rawPage, 10) - 1 : defaultPage;
  };

  const [pageNumber, setPageNumber] = useState(() => getNewPage());

  useEffect(() => {
    navigate(`/?page=${pageNumber + 1}`, { replace: true });
  }, [pageNumber, navigate]);

  useEffect(() => {
    const newPage = getNewPage();
    if (newPage !== pageNumber) {
      setPageNumber(newPage);
    }
  }, [location.search, pageNumber]);

  return { pageNumber, setPageNumber };
}
