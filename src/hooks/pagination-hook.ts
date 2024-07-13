import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function usePagination(defaultPage = 0) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = new URLSearchParams(location.search).get('page');

  const [pageNumber, setPageNumber] = useState(
    currentPage ? parseInt(currentPage, 10) - 1 : defaultPage
  );

  const changePage = (newPageNumber: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', `${newPageNumber + 1}`);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    const onPage = new URLSearchParams(location.search).get('page');
    if (onPage) {
      const onPageNumber = parseInt(onPage, 10) - 1;
      if (onPageNumber !== pageNumber) {
        setPageNumber(onPageNumber);
      }
    }
  }, [location.search, pageNumber]);

  return { pageNumber, setPageNumber: changePage };
}
