import * as yup from 'yup';

const MAX_FILE_SIZE = 3000000;

export const yupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Z].*$/, {
      message: 'First letter must be uppercase, followed by lowercase',
      excludeEmptyString: true,
    }),
  age: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .required('Age is required')
    .positive('Age must be a positive number')
    .integer('Age must be an integer'),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/,
      'Password must include one lowercase letter, one uppercase letter, a number, and a special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Password confirmation is required'),
  gender: yup.string().required('Gender is required'),
  terms: yup.bool().oneOf([true], 'You must accept the terms and conditions'),
  image: yup
    .mixed<FileList>()
    .nullable()
    .notRequired()
    .test('fileSize', 'File too large', (value) => {
      if (!value || value.length === 0) return true;
      const file = value[0];
      return file.size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || value.length === 0) return true;
      const file = value[0];
      return ['image/jpeg', 'image/png'].includes(file.type);
    }),
  country: yup.string().required('Country is required'),
});
