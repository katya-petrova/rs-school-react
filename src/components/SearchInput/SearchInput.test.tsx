import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  test('renders with placeholder and initial value', () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <SearchInput term="" onChange={onChange} onSearch={onSearch} />
    );

    const inputElement = getByPlaceholderText(
      'Type pokemon name e.g. raticate'
    );
    const searchButton = getByText('Search');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    expect(searchButton).toBeInTheDocument();
  });

  test('calls onSearch handler when Search button is clicked', () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();
    const { getByText } = render(
      <SearchInput term="" onChange={onChange} onSearch={onSearch} />
    );

    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  test('calls onSearch handler when Enter key is pressed', () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput term="" onChange={onChange} onSearch={onSearch} />
    );

    const inputElement = getByPlaceholderText(
      'Type pokemon name e.g. raticate'
    );
    fireEvent.change(inputElement, { target: { value: 'charmander' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
