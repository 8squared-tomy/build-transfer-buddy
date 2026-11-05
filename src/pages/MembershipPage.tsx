import { DynamicForm } from '@/components/DynamicForm';
import { useLanguage } from '@/i18n/LanguageProvider';
export function MembershipPage(){const {t}=useLanguage();return <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><p className="eyebrow">{t('navMembership')}</p><h1 className="mt-3 text-3xl">{t('membershipTitle')}</h1><div className="mt-10"><DynamicForm scope="membership"/></div></section>;}
