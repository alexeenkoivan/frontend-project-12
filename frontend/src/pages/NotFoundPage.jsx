import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('notFound.header')}</h1>
      <p>
        {t('notFound.message')} <a href="/">{t('notFound.linkText')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
