import React from 'react';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('notFound.header')}</h1>
      <p>
        {t('notFound.message')} <a href={routes.ROUTES.HOME}>{t('notFound.linkText')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
