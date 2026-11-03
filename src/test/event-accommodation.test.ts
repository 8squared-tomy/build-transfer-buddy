import { describe, expect, it } from 'vitest';
import { validateRegistration, registrationSchema, type RegistrationInput } from '@/lib/validation';

const base: RegistrationInput = { fullName: 'Test Visitor', email: 'visitor@example.com', university: 'Test University', needsAccommodation: false, residence: '', bacRegistrationNumber: '', phone: '' };

describe('event accommodation rules', () => {
  it('allows registration without accommodation details when not requested', () => {
    expect(validateRegistration(base)).toEqual({});
  });
  it('requires current residence when accommodation is requested', () => {
    expect(validateRegistration({ ...base, needsAccommodation: true }).residence).toBe('errResidence');
  });
  it('requires baccalaureate registration number when accommodation is requested', () => {
    expect(validateRegistration({ ...base, needsAccommodation: true }).bacRegistrationNumber).toBe('errBacNumber');
  });
  it('requires phone only when accommodation is requested', () => {
    expect(validateRegistration({ ...base, needsAccommodation: true }).phone).toBe('errAccommodationPhone');
    expect(validateRegistration(base).phone).toBeUndefined();
  });
  it('accepts complete accommodation details and preserves leading zeroes', () => {
    const result = registrationSchema.safeParse({ ...base, needsAccommodation: true, residence: 'University Residence', bacRegistrationNumber: '001234567', phone: '0555123456' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.bacRegistrationNumber).toBe('001234567');
  });
  it('rejects malformed accommodation details', () => {
    expect(validateRegistration({ ...base, needsAccommodation: true, residence: 'X', bacRegistrationNumber: '12abc', phone: 'abc' })).toEqual({ residence: 'errResidence', bacRegistrationNumber: 'errBacNumber', phone: 'errAccommodationPhone' });
  });
});