import { formatDate, truncateText } from '../formatters';

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    const result = formatDate('2025-01-15T00:00:00.000Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('formats a different date correctly', () => {
    const result = formatDate('2024-12-25T10:30:00.000Z');
    expect(result).toContain('Dec');
    expect(result).toContain('25');
    expect(result).toContain('2024');
  });
});

describe('truncateText', () => {
  it('returns text unchanged when shorter than maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('returns text unchanged when exactly maxLength', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('truncates text longer than maxLength and adds ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('trims trailing spaces before adding ellipsis', () => {
    expect(truncateText('hello world foo', 6)).toBe('hello...');
  });

  it('handles empty string', () => {
    expect(truncateText('', 5)).toBe('');
  });

  it('handles maxLength of 0', () => {
    expect(truncateText('hello', 0)).toBe('...');
  });
});
