import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupSchema } from '../../consts/yupConfig';
import { setFormData } from '../../store/UncontrolledFormSlice';
import { useSelector } from 'react-redux';
import {
  FormContainer,
  InputContainer,
  Form,
  Input,
  Label,
  SubmitButton,
  ErrorMsg,
} from './UncontrolledFormStyles';

import * as yup from 'yup';
import { RootState } from '../../store/store';

interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  terms?: string;
  picture?: string;
  country?: string;
}

const UncontrolledFormPage = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const countries = useSelector(
    (state: RootState) => state.uncontrolledForm.countries
  );
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    number: false,
    upper: false,
    lower: false,
    special: false,
  });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    const minLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[\W_]/.test(password);

    setPasswordStrength({
      minLength,
      number: hasNumber,
      upper: hasUpper,
      lower: hasLower,
      special: hasSpecial,
    });
  };

  const convertFileToBase64 = (
    file: File,
    callback: (result: string | ArrayBuffer | null) => void
  ): void => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) =>
      console.error('Error converting file to base64!', error);
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get('name') as string | null,
      age: formData.get('age')
        ? parseInt(formData.get('age') as string, 10)
        : null,
      email: formData.get('email') as string | null,
      password: formData.get('password') as string | null,
      confirmPassword: formData.get('confirmPassword') as string | null,
      gender: formData.get('gender') as string | null,
      terms: formData.get('terms') === 'on',
      picture: formData.get('picture') as File | null,
      country: formData.get('country') as string | null,
    };

    try {
      await yupSchema.validate(data, { abortEarly: false });
      setErrors({});

      if (data.picture && data.picture.size > 0) {
        convertFileToBase64(data.picture, (base64String) => {
          const { picture, ...restOfData } = data;
          const modifiedData = {
            ...restOfData,
            image: base64String as string,
          };
          dispatch(setFormData(modifiedData));
          navigate('/');
        });
      } else {
        const { picture, ...restOfData } = data;
        dispatch(setFormData({ ...restOfData, image: null }));
        navigate('/');
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = error.inner.reduce(
          (acc: FormErrors, err) => ({
            ...acc,
            [err.path || '']: err.message,
          }),
          {}
        );
        setErrors(newErrors);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <FormContainer>
      <Form ref={formRef} onSubmit={submitForm}>
        <InputContainer>
          <Label htmlFor="name">Name:</Label>
          <Input type="text" id="name" name="name" />
          {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="age">Age:</Label>
          <Input type="number" id="age" name="age" />
          {errors.age && <ErrorMsg>{errors.age}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="email">Email:</Label>
          <Input type="email" id="email" name="email" />
          {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            name="password"
            onChange={handlePasswordChange}
          />
          {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
          <div>
            <p>Password Strength:</p>
            <ul>
              <li
                style={{ color: passwordStrength.minLength ? 'green' : 'red' }}
              >
                At least 8 characters
              </li>
              <li style={{ color: passwordStrength.number ? 'green' : 'red' }}>
                Contains a number
              </li>
              <li style={{ color: passwordStrength.upper ? 'green' : 'red' }}>
                Contains an uppercase letter
              </li>
              <li style={{ color: passwordStrength.lower ? 'green' : 'red' }}>
                Contains a lowercase letter
              </li>
              <li style={{ color: passwordStrength.special ? 'green' : 'red' }}>
                Contains a special character
              </li>
            </ul>
          </div>
        </InputContainer>

        <InputContainer>
          <Label htmlFor="confirmPassword">Confirm Password:</Label>
          <Input type="password" id="confirmPassword" name="confirmPassword" />
          {errors.confirmPassword && (
            <ErrorMsg>{errors.confirmPassword}</ErrorMsg>
          )}
        </InputContainer>

        <div>
          <Label htmlFor="gender">Gender:</Label>
          <select id="gender" name="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <InputContainer>
          <Label htmlFor="picture">Upload Picture:</Label>
          <Input
            type="file"
            id="picture"
            name="picture"
            accept="image/png, image/jpeg"
          />
          {errors.picture && <ErrorMsg>{errors.picture}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="country">Country:</Label>
          <Input list="country-list" id="country" name="country" type="text" />
          <datalist id="country-list">
            {Array.isArray(countries) &&
              countries.map((country, index) => (
                <option key={index} value={country} />
              ))}
          </datalist>
          {errors.country && <ErrorMsg>{errors.country}</ErrorMsg>}
        </InputContainer>

        <InputContainer className="terms">
          <Label htmlFor="terms">Accept T&C:</Label>
          <Input type="checkbox" id="terms" name="terms" />
          {errors.terms && <ErrorMsg>{errors.terms}</ErrorMsg>}
        </InputContainer>

        <SubmitButton type="submit">Submit</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default UncontrolledFormPage;
