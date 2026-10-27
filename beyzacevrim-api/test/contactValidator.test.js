import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateContact } from '../src/validators/contact.validator.js';
import { validMessage } from './helpers.js';

describe('validateContact', () => {
  it('accepts a valid message, trims fields and defaults the locale to en', () => {
    const { value, errors } = validateContact({ ...validMessage, name: '  Test Person  ' });
    assert.deepEqual(errors, {});
    assert.equal(value.name, 'Test Person');
    assert.equal(value.locale, 'en');
    assert.equal(value.subject, 'Hello');
  });

  it('accepts every supported locale', () => {
    for (const locale of ['en', 'tr', 'es', 'de']) {
      assert.deepEqual(validateContact({ ...validMessage, locale }).errors, {});
    }
  });

  it('rejects non-object bodies', () => {
    assert.ok(validateContact(null).errors.body);
    assert.ok(validateContact([]).errors.body);
  });

  it('rejects wrong types instead of coercing them', () => {
    const { errors } = validateContact({ ...validMessage, name: ['Test'], message: { text: 'x'.repeat(20) } });
    assert.ok(errors.name);
    assert.ok(errors.message);
  });

  it('enforces length limits', () => {
    assert.ok(validateContact({ ...validMessage, message: 'x'.repeat(5001) }).errors.message);
    assert.ok(validateContact({ ...validMessage, subject: 'x'.repeat(151) }).errors.subject);
  });

  it('rejects line breaks in fields used for the email subject line', () => {
    const { errors } = validateContact({ ...validMessage, name: 'Test\nBcc: x@example.com', subject: 'Hi\r\nthere' });
    assert.ok(errors.name);
    assert.ok(errors.subject);
    assert.deepEqual(validateContact({ ...validMessage, message: 'Line one\nline two' }).errors, {});
  });

  it('accepts common phone formats and an empty phone', () => {
    for (const phone of ['', '+90 555 123 45 67', '0555 123 45 67', '+1 (415) 555-0100', '030.1234567']) {
      assert.deepEqual(validateContact({ ...validMessage, phone }).errors, {}, phone);
    }
  });

  it('rejects invalid phone numbers', () => {
    for (const phone of ['12345', 'call me', '+90 555 abc', '1'.repeat(16), '+90\n555 123 45 67', 5551234567]) {
      assert.ok(validateContact({ ...validMessage, phone }).errors.phone, String(phone));
    }
  });

  it('subject is optional', () => {
    const { subject, ...withoutSubject } = validMessage;
    assert.equal(subject, 'Hello');
    assert.deepEqual(validateContact(withoutSubject).errors, {});
  });
});
