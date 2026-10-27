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

  it('subject is optional', () => {
    const { subject, ...withoutSubject } = validMessage;
    assert.equal(subject, 'Hello');
    assert.deepEqual(validateContact(withoutSubject).errors, {});
  });
});
