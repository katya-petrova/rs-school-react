import { FC } from 'react';
import {
  Container,
  LinksContainer,
  FormLink,
  FormInfo,
} from './MainPageStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import FormInfoBox from '../../components/FormInfoBox/FormInfoBox';

const MainPage: FC = () => {
  const uncontrolledFormData = useSelector(
    (state: RootState) => state.uncontrolledForm
  );
  const controlledFormData = useSelector(
    (state: RootState) => state.controlledForm
  );

  return (
    <Container>
      <LinksContainer>
        <FormInfo>
          <FormLink to="/uncontrolled-form">Uncontrolled Form</FormLink>
          <FormInfoBox formData={uncontrolledFormData}></FormInfoBox>
        </FormInfo>

        <FormInfo>
          <FormLink to="/react-hook-form">React Hook Form</FormLink>
          <FormInfoBox formData={controlledFormData}></FormInfoBox>
        </FormInfo>
      </LinksContainer>
    </Container>
  );
};

export default MainPage;
