import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../counterSlice';
import Counter from '../Counter';

function renderWithStore(preloadedState = { counter: { value: 0 } }) {
  const store = configureStore({
    reducer: { counter: counterReducer },
    preloadedState,
  });
  return { store, ...render(<Provider store={store}><Counter /></Provider>) };
}

describe('Counter component', () => {
  it('renders the current count', () => {
    renderWithStore({ counter: { value: 42 } });
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders the counter title', () => {
    renderWithStore();
    expect(screen.getByText('Redux Counter Demo')).toBeInTheDocument();
  });

  it('increments count when Increment button is clicked', () => {
    const { store } = renderWithStore();
    fireEvent.click(screen.getByText('Increment'));
    expect(store.getState().counter.value).toBe(1);
  });

  it('decrements count when Decrement button is clicked', () => {
    const { store } = renderWithStore({ counter: { value: 5 } });
    fireEvent.click(screen.getByText('Decrement'));
    expect(store.getState().counter.value).toBe(4);
  });

  it('increments by custom amount', () => {
    const { store } = renderWithStore();
    const input = screen.getByLabelText('Amount');
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.click(screen.getByText('Add Amount'));
    expect(store.getState().counter.value).toBe(7);
  });
});
