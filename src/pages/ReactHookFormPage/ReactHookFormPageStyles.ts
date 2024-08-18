import styled from 'styled-components';

export const FormContainer = styled.div`
  background: #f8f4e5;
  padding: 50px 100px;
  border: 2px solid black;
  box-shadow:
    15px 15px 1px #ffa580,
    15px 15px 1px 2px black;
  width: 510px;
  margin: 11rem auto;
`;

export const ErrorMsg = styled.p`
  color: red;
  font-size: 12px;
  position: absolute;
  top: 65px;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  &.terms {
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
    justify-content: flex-start;
    margin-bottom: 10px;

    ${ErrorMsg} {
        top: 16px;
      }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: flex-start;

  .input-container {
    display: flex;
    flex-direction: column;
    width: 500px;
    position: relative;
  }
`;

export const Input = styled.input`
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Label = styled.label`
  margin-top: 10px;
  text-transform: uppercase;
`;

export const Select = styled.select`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  background: white;
`;

export const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

export const SubmitButton = styled.button`
  margin: 0 auto;
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: darkblue;
  }

  &:disabled {
    background-color: gray;
    color: #ccc;
    cursor: not-allowed;
  }
`;

export const RadioButton = styled.div`
  display: flex;
  gap: 40px;
`;
