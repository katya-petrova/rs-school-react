import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FormData } from '../../store/UncontrolledFormSlice';
import { resetRecentlySubmitted as resetUncontrolledRecentlySubmitted } from '../../store/UncontrolledFormSlice';
import { resetRecentlySubmitted as resetControlledRecentlySubmitted } from '../../store/ControlledFormSlice';
import { DataField, PictureField, StyledFormInfo } from './FormInfoBoxStyles';

interface FormInfoBoxProps {
  formData: FormData;
}

const FormInfoBox: React.FC<FormInfoBoxProps> = ({ formData }) => {
  const dispatch = useDispatch();
  const data = formData.formData;

  useEffect(() => {
    if (formData.recentlySubmitted) {
      const timer = setTimeout(() => {
        dispatch(resetUncontrolledRecentlySubmitted());
        dispatch(resetControlledRecentlySubmitted());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [formData.recentlySubmitted, dispatch]);

  if (!data.name) {
    return (
      <StyledFormInfo>
        <h3>Please fill out the form first.</h3>
      </StyledFormInfo>
    );
  }

  return (
    <StyledFormInfo className={formData.recentlySubmitted ? 'highlight' : ''}>
      <h3>Form Data:</h3>
      <div className="dataFields">
        {Object.entries(data).map(([key, value]) => {
          if (key === 'image') return null;
          return (
            <DataField key={key}>
              <strong>{key}:</strong> {value?.toString()}
            </DataField>
          );
        })}
      </div>
      {data.image && (
        <PictureField>
          <strong>Picture:</strong>
          <img src={data.image} alt="Uploaded" style={{ maxWidth: '250px' }} />
        </PictureField>
      )}
    </StyledFormInfo>
  );
};

export default FormInfoBox;
