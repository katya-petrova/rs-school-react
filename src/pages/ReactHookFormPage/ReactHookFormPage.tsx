import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { yupSchema } from '../../consts/yupConfig';
import {
  FormContainer,
  InputContainer,
  Form,
  Input,
  Label,
  RadioButton,
  ErrorMsg,
  SubmitButton,
} from './ReactHookFormPageStyles';
import { updateFormData } from '../../store/ControlledFormSlice';
import { RootState } from '../../store/store';
import { useState, useEffect } from 'react';

interface IFormData {
  name?: string | null;
  age?: number | null;
  email?: string | null;
  password?: string | null;
  gender?: string | null;
  terms?: boolean;
  image?: FileList | string | null;
  country?: string | null;
}

function HookFormComponent() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(yupSchema),
    mode: 'onChange',
    defaultValues: {
      gender: 'Male',
    },
  });

  const countries = useSelector(
    (state: RootState) => state.controlledForm.countries
  );
  const passwordValue = watch('password') ?? '';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    number: false,
    uppercased: false,
    lowercased: false,
    specialChar: false,
  });

  useEffect(() => {
    const lengthCheck = passwordValue.length >= 8;
    const numberCheck = /[0-9]/.test(passwordValue);
    const upperCheck = /[A-Z]/.test(passwordValue);
    const lowerCheck = /[a-z]/.test(passwordValue);
    const specialCheck = /[\W_]+/.test(passwordValue);

    setPasswordStrength({
      minLength: lengthCheck,
      number: numberCheck,
      uppercased: upperCheck,
      lowercased: lowerCheck,
      specialChar: specialCheck,
    });
  }, [passwordValue]);

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

  const onSubmit = (data: IFormData) => {
    const updateAndNavigate = (
      finalData: Omit<IFormData, 'image'> & { image?: string }
    ) => {
      const payload = {
        ...finalData,
        name: finalData.name ?? null,
        age: finalData.age ?? null,
        email: finalData.email ?? null,
        password: finalData.password ?? null,
        gender: finalData.gender ?? null,
        country: finalData.country ?? null,
        image: finalData.image ?? null,
        terms: finalData.terms === undefined ? false : finalData.terms,
      };
      dispatch(updateFormData(payload));
      navigate('/');
    };

    if (data.image && data.image instanceof FileList && data.image.length > 0) {
      const file = data.image[0];
      if (file instanceof File) {
        convertFileToBase64(
          file,
          (base64String: string | ArrayBuffer | null) => {
            if (typeof base64String === 'string') {
              const formDataWithBase64 = {
                ...data,
                image: base64String,
              };
              updateAndNavigate(formDataWithBase64);
            } else {
              console.error('Failed to convert image to base64 string');
              updateAndNavigate({
                ...data,
                image: undefined,
              });
            }
          }
        );
      }
    } else {
      updateAndNavigate({
        ...data,
        image: undefined,
      });
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <Label htmlFor="name">Name:</Label>
          <Input {...register('name')} type="text" id="name" />
          {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="age">Age:</Label>
          <Input {...register('age')} type="number" id="age" />
          {errors.age && <ErrorMsg>{errors.age.message}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="email">Email:</Label>
          <Input {...register('email')} type="email" id="email" />
          {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="password">Password:</Label>
          <Input {...register('password')} type="password" id="password" />
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
              <li
                style={{ color: passwordStrength.uppercased ? 'green' : 'red' }}
              >
                Contains an uppercase letter
              </li>
              <li
                style={{ color: passwordStrength.lowercased ? 'green' : 'red' }}
              >
                Contains a lowercase letter
              </li>
              <li
                style={{
                  color: passwordStrength.specialChar ? 'green' : 'red',
                }}
              >
                Contains a special character
              </li>
            </ul>
          </div>
          {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="confirmPassword">Confirm Password:</Label>
          <Input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
          />
          {errors.confirmPassword && (
            <ErrorMsg>{errors.confirmPassword.message}</ErrorMsg>
          )}
        </InputContainer>

        <div className="radio-button">
          <Label>Gender:</Label>
          <RadioButton>
            <div>
              <Input
                {...register('gender')}
                type="radio"
                id="male"
                value="Male"
              />
              <Label htmlFor="male">Male</Label>
            </div>
            <div>
              <Input
                {...register('gender')}
                type="radio"
                id="female"
                value="Female"
              />
              <Label htmlFor="female">Female</Label>
            </div>
            <div>
              <Input
                {...register('gender')}
                type="radio"
                id="other"
                value="Other"
              />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioButton>
          {errors.gender && <ErrorMsg>{errors.gender.message}</ErrorMsg>}
        </div>

        <InputContainer>
          <Label htmlFor="picture">Upload Picture:</Label>
          <Input
            {...register('image')}
            type="file"
            id="picture"
            accept="image/png, image/jpeg"
          />
          {errors.image && <ErrorMsg>{errors.image.message}</ErrorMsg>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="country">Country:</Label>
          <Input
            {...register('country')}
            list="country-list"
            type="text"
            id="country"
          />
          <datalist id="country-list">
            {countries.map((country, index) => (
              <option key={index} value={country} />
            ))}
          </datalist>
          {errors.country && <ErrorMsg>{errors.country.message}</ErrorMsg>}
        </InputContainer>

        <InputContainer className="terms">
          <Label htmlFor="terms">Accept T&C:</Label>
          <Input {...register('terms')} type="checkbox" id="terms" />
          {errors.terms && <ErrorMsg>{errors.terms.message}</ErrorMsg>}
        </InputContainer>

        <SubmitButton type="submit" disabled={!isValid}>
          Submit
        </SubmitButton>
      </Form>
    </FormContainer>
  );
}

export default HookFormComponent;
