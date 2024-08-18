import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div``;

export const LinksContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 8rem;
`;

export const FormInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

export const FormLink = styled(Link)`
  display: flex;
  padding: 20px;
  border: 2px solid black;
  background: beige;
  text-decoration: none;
  font-weight: 700;
  box-shadow:
    15px 15px 1px #ffa580,
    15px 15px 1px 2px black;
  transition:
    background-color 0.3s,
    box-shadow 0.3s,
    border 0.3s;

  &:hover {
    background-color: #f5f5dc;
    box-shadow:
      15px 15px 5px #ffcba4,
      15px 15px 5px 3px black;
  }
`;
