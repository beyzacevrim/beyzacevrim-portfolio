import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import useI18n from '../hooks/useI18n.js'
import { sendContactMessage } from '../services/contactService.js'

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '', website: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d ().-]+$/
const FIELDS = ['name', 'email', 'phone', 'subject', 'message']

// Mirrors the API rules so most mistakes are caught before a request is sent.
// Returns the names of invalid fields; messages come from the active locale.
function findInvalidFields(values) {
  const invalid = []
  const name = values.name.trim()
  const message = values.message.trim()
  const phone = values.phone.trim()
  const phoneDigits = phone.replace(/\D/g, '').length

  if (name.length < 2 || name.length > 100) invalid.push('name')
  if (!EMAIL_PATTERN.test(values.email.trim())) invalid.push('email')
  if (phone && (phone.length > 30 || !PHONE_PATTERN.test(phone) || phoneDigits < 7 || phoneDigits > 15)) invalid.push('phone')
  if (values.subject.trim().length > 150) invalid.push('subject')
  if (message.length < 10 || message.length > 5000) invalid.push('message')
  return invalid
}

// The API answers in English; visitors see the matching message in their language instead.
const SERVER_ERRORS = {
  NETWORK_ERROR: 'network',
  TOO_MANY_REQUESTS: 'rateLimit',
  SERVICE_UNAVAILABLE: 'unavailable',
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.18em]">
        {label}
        {optional && <span className="normal-case tracking-normal text-ink/70">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-[#c2410c]">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border-2 border-ink bg-white/70 px-4 py-3 text-base outline-none transition-shadow placeholder:text-ink/65 focus:shadow-[4px_4px_0_0_var(--color-cobalt)] aria-[invalid=true]:border-[#c2410c]'

export default function ContactForm() {
  const { t, lang } = useI18n()
  const [values, setValues] = useState(EMPTY)
  // Invalid field names and the server error key are stored, not messages, so they re-render on language change.
  const [invalid, setInvalid] = useState([])
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState(null)

  const errorFor = (field) => (invalid.includes(field) ? t.contact.errors[field] : undefined)

  const update = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (invalid.includes(name)) setInvalid((current) => current.filter((field) => field !== name))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = findInvalidFields(values)
    setInvalid(found)
    setServerError(null)
    if (found.length > 0) return

    setStatus('sending')
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
        locale: lang,
      })
      setStatus('sent')
      setValues(EMPTY)
    } catch (err) {
      setStatus('error')
      const fields = Object.keys(err.details ?? {}).filter((field) => FIELDS.includes(field))
      setInvalid(fields)
      setServerError(fields.length > 0 ? null : (SERVER_ERRORS[err.code] ?? 'generic'))
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border-2 border-ink bg-lime p-8" role="status">
        <CheckCircle2 className="size-10" aria-hidden="true" />
        <p className="font-display text-3xl font-bold tracking-tight">{t.contact.form.successTitle}</p>
        <p className="text-ink/75">{t.contact.form.successBody}</p>
        <button type="button" onClick={() => setStatus('idle')} className="link-underline font-semibold">
          {t.contact.form.sendAnother}
        </button>
      </div>
    )
  }

  const fieldProps = (field) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: update,
    'aria-invalid': invalid.includes(field),
    'aria-describedby': invalid.includes(field) ? `${field}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-5 rounded-3xl border-2 border-ink bg-cream p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t.contact.form.name} error={errorFor('name')}>
          <input {...fieldProps('name')} className={inputClass} autoComplete="name" required />
        </Field>
        <Field id="email" label={t.contact.form.email} error={errorFor('email')}>
          <input {...fieldProps('email')} type="email" className={inputClass} autoComplete="email" required />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label={t.contact.form.phone} error={errorFor('phone')} optional={t.contact.form.optional}>
          <input {...fieldProps('phone')} type="tel" inputMode="tel" className={inputClass} autoComplete="tel" />
        </Field>
        <Field id="subject" label={t.contact.form.subject} error={errorFor('subject')} optional={t.contact.form.optional}>
          <input {...fieldProps('subject')} className={inputClass} />
        </Field>
      </div>
      <Field id="message" label={t.contact.form.message} error={errorFor('message')}>
        <textarea {...fieldProps('message')} rows={5} className={`${inputClass} resize-y`} placeholder={t.contact.form.placeholder} required />
      </Field>

      {/* Honeypot: hidden from people and assistive technology, often filled in by bots. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
      </div>

      {serverError && (
        <p className="rounded-xl bg-orange/20 px-4 py-3 text-sm font-medium" role="alert">
          {t.contact.errors[serverError]}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-cobalt disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? (
          <>
            {t.contact.form.sending} <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            {t.contact.form.send} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}
