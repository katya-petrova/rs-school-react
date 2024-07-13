import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function usePagination(defaultPage = 0) {
  const location = useLocation();
  const navigate = useNavigate();

  const rawPage = new URLSearchParams(location.search).get('page');
  const currentPage = rawPage ? parseInt(rawPage, 10) - 1 : defaultPage;

  const [pageNumber, setPageNumber] = useState(currentPage);

  useEffect(() => {
    navigate(`/?page=${pageNumber + 1}`, { replace: true });
  }, [pageNumber, navigate]);

  useEffect(() => {
    const rawPage = new URLSearchParams(location.search).get('page');
    const newPage = rawPage ? parseInt(rawPage, 10) - 1 : 0;
    if (newPage !== pageNumber) {
      setPageNumber(newPage);
    }
  }, [location.search]);

  return { pageNumber, setPageNumber };
}
