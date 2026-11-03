import { useState, type FormEvent } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField, Notice } from '@/components/FormField';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';
import { registerForEvent, type RegistrationPayload } from '@/lib/publicApi';
import type { EventState } from '@/lib/events';
import { validateRegistration, type FieldErrors, type RegistrationInput } from '@/lib/validation';
import type { RegistrationStatus } from '@/types/club';

const EMPTY_FORM: RegistrationInput = { fullName: '', email: '', university: '', phone: '', needsAccommodation: false, residence: '', bacRegistrationNumber: '' };

type Props = {
  eventId: string;
  state: EventState;
  onRegistered: () => void;
};

export function EventRegistrationForm({ eventId, state, onRegistered }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState<RegistrationInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<keyof RegistrationInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<TranslationKey | null>(null);
  const [result, setResult] = useState<RegistrationStatus | null>(null);

  const isWaitlistOnly = state === 'full';

  const update = (field: keyof RegistrationInput) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateRegistration(form);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`reg-${firstError}`)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);
    const payload: RegistrationPayload = { eventId, ...form };
    const outcome = await registerForEvent(payload);
    setSubmitting(false);

    if (outcome.ok) {
      setResult(outcome.data);
      setForm(EMPTY_FORM);
      onRegistered();
    } else {
      setServerError(outcome.errorKey);
    }
  };

  if (result) {
    const confirmed = result === 'confirmed';
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        {confirmed ? (
          <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
        ) : (
          <Clock className="h-12 w-12 text-warning" aria-hidden="true" />
        )}
        <h3 className="text-2xl">{confirmed ? t('registrationConfirmedTitle') : t('registrationWaitlistedTitle')}</h3>
        <p className="text-muted">{confirmed ? t('registrationConfirmedBody') : t('registrationWaitlistedBody')}</p>
      </div>
    );
  }

  if (state === 'past' || state === 'closed') {
    return <p className="text-muted">{state === 'past' ? t('registerPast') : t('registerClosed')}</p>;
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {isWaitlistOnly && <Notice tone="success">{t('registerWaitlistNote')}</Notice>}
      {serverError && <Notice tone="error">{t(serverError)}</Notice>}

      <FormField label={t('fieldFullName')} htmlFor="reg-fullName" required error={errors.fullName && t(errors.fullName)}>
        <input
          id="reg-fullName"
          name="fullName"
          autoComplete="name"
          maxLength={100}
          required
          className="input"
          value={form.fullName}
          onChange={(event) => update('fullName')(event.target.value)}
          aria-invalid={Boolean(errors.fullName)}
        />
      </FormField>
      <FormField label={t('fieldEmail')} htmlFor="reg-email" required error={errors.email && t(errors.email)}>
        <input
          id="reg-email"
          name="email"
          type="email"
          maxLength={254}
          required
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          className="input"
          value={form.email}
          onChange={(event) => update('email')(event.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </FormField>
      <FormField label={t('fieldUniversity')} htmlFor="reg-university" required error={errors.university && t(errors.university)}>
        <input
          id="reg-university"
          name="university"
          autoComplete="organization"
          maxLength={120}
          required
          className="input"
          value={form.university}
          onChange={(event) => update('university')(event.target.value)}
          aria-invalid={Boolean(errors.university)}
        />
      </FormField>
      <fieldset className="space-y-4">
        <legend className="field-label mb-3">{t('accommodationQuestion')}</legend>
        <div className="flex flex-wrap gap-6">
          {[true, false].map((value) => (
            <label key={String(value)} className="flex min-h-11 cursor-pointer items-center gap-2">
              <input type="radio" name="needsAccommodation" checked={form.needsAccommodation === value} onChange={() => {
                setForm((current) => ({ ...current, needsAccommodation: value, ...(!value ? { phone: '', residence: '', bacRegistrationNumber: '' } : {}) }));
                setErrors({});
              }} />
              {value ? t('answerYes') : t('answerNo')}
            </label>
          ))}
        </div>
        {form.needsAccommodation && <div className="space-y-6 border-s-2 border-border ps-4">
          <FormField label={t('fieldResidence')} htmlFor="reg-residence" required error={errors.residence && t(errors.residence)}>
            <input id="reg-residence" name="residence" className="input" required maxLength={120} value={form.residence} onChange={(event) => update('residence')(event.target.value)} aria-invalid={Boolean(errors.residence)} />
          </FormField>
          <FormField label={t('fieldBacNumber')} htmlFor="reg-bacRegistrationNumber" required error={errors.bacRegistrationNumber && t(errors.bacRegistrationNumber)}>
            <input id="reg-bacRegistrationNumber" name="bacRegistrationNumber" className="input" required inputMode="numeric" dir="ltr" maxLength={30} value={form.bacRegistrationNumber} onChange={(event) => update('bacRegistrationNumber')(event.target.value)} aria-invalid={Boolean(errors.bacRegistrationNumber)} />
          </FormField>
      <FormField label={t('fieldPhone')} htmlFor="reg-phone" required error={errors.phone && t(errors.phone)}>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          required
          maxLength={25}
          autoComplete="tel"
          dir="ltr"
          className="input"
          value={form.phone}
          onChange={(event) => update('phone')(event.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
      </FormField>
        </div>}
      </fieldset>

      <Button type="submit" className="btn-primary h-auto w-full whitespace-normal" disabled={submitting}>
        {submitting ? t('submitting') : isWaitlistOnly ? t('registerWaitlistButton') : t('registerButton')}
      </Button>
    </form>
  );
}
