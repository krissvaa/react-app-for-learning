import counterReducer, { increment, decrement, incrementByAmount } from '../counterSlice';

describe('counterSlice', () => {
  const initialState = { value: 0 };

  it('should return the initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle increment', () => {
    const state = counterReducer(initialState, increment());
    expect(state.value).toBe(1);
  });

  it('should handle decrement', () => {
    const state = counterReducer({ value: 5 }, decrement());
    expect(state.value).toBe(4);
  });

  it('should handle incrementByAmount', () => {
    const state = counterReducer(initialState, incrementByAmount(10));
    expect(state.value).toBe(10);
  });

  it('should handle incrementByAmount with negative value', () => {
    const state = counterReducer({ value: 5 }, incrementByAmount(-3));
    expect(state.value).toBe(2);
  });

  it('should handle multiple increments', () => {
    let state = counterReducer(initialState, increment());
    state = counterReducer(state, increment());
    state = counterReducer(state, increment());
    expect(state.value).toBe(3);
  });
});
