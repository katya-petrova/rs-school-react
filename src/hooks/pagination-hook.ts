import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setPage } from '../store/currentPageSlice';
import { RootState } from '../store/store';

export function usePagination() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pageNumber = useSelector((state: RootState) => state.page);

  const changePage = (newPageNumber: number) => {
    dispatch(setPage(newPageNumber));

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', `${newPageNumber + 1}`);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    const onPage = new URLSearchParams(location.search).get('page');
    const onPageNumber = onPage ? parseInt(onPage, 10) - 1 : 0;

    if (onPageNumber !== pageNumber) {
      changePage(onPageNumber);
    }
  }, [location.search, pageNumber]);

  return { pageNumber, setPageNumber: changePage };
}
