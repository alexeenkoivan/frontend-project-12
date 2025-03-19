import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormControl, FormGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useRenameChannelMutation, useGetChannelsQuery } from '../slices/channelsSlice.js';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

const RenameChannelModal = ({ channel, onHide }) => {
  const { t } = useTranslation();
  const inputRef = useRef();

  const { data: channels = [] } = useGetChannelsQuery();

  const [renameChannel] = useRenameChannelMutation();

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('modals.min'))
        .max(20, t('modals.max'))
        .notOneOf(channels.map((ch) => ch.name), t('modals.uniq'))
        .required(t('modals.required')),
    }),
    onSubmit: async (values) => {
      try {
        const cleanedName = leoProfanity.clean(values.name);
        await renameChannel({ id: channel.id, name: cleanedName }).unwrap();
        toast.success(t('channels.renamed'));
        onHide();
      } catch (err) {
        toast.error(t('errors.toastifyRename'));
      }
    },
  });

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <label htmlFor="name" className="form-label">
              {t('modals.channelName')}
            </label>
            <FormControl
              ref={inputRef}
              id="name"
              name="name"
              placeholder={t('modals.channelName')}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <FormControl.Feedback type="invalid">
              {formik.errors.name}
            </FormControl.Feedback>
          </FormGroup>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} className="me-2">
              {t('modals.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('modals.submit')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

RenameChannelModal.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
};

export default RenameChannelModal;
