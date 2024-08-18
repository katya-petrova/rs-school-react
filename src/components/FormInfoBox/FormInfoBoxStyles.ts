import styled, { keyframes } from 'styled-components';

const runBorder = keyframes`
  0% {
    border-image-source: linear-gradient(
      to right,
      red, orange, yellow, green, blue, indigo, violet
    );
  }
  100% {
    border-image-source: linear-gradient(
      to right,
      violet, red, orange, yellow, green, blue, indigo
    );
  }
`;

export const StyledFormInfo = styled.div`
  padding: 15px;
  margin-top: 41px;
  border-radius: 5px;
  background-color: #f4f4f4;
  border: 4px solid #ea37f857;
  width: 250px;

  &.highlight {
    border-image-slice: 1;
    border-image-source: linear-gradient(
      to right,
      red,
      orange,
      yellow,
      green,
      blue,
      indigo,
      violet
    );
    animation: ${runBorder} 2s linear infinite;
  }
`;
export const DataField = styled.div`
  margin-bottom: 10px;
`;

export const PictureField = styled.div`
  margin-top: 15px;
`;
