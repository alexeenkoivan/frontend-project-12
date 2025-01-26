import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Modal, Button, FormControl, FormGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../slices/channelsSlice.js';
import { toast } from 'react-toastify';

const AddChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('modals.min'))
        .max(20, t('modals.max'))
        .notOneOf(channels.map((channel) => channel.name), t('modals.uniq'))
        .required(t('modals.required')),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addChannel({ name: values.name })).unwrap();
        toast.success(t('channels.created'));
        resetForm();
        onHide();
      } catch (err) {
        toast.error(t('errors.toastifyAdd'));
      }
    },
  });

  const inputRef = useRef();

  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              name="name"
              placeholder={t('modals.channelName')}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <FormControl.Feedback type="invalid">{formik.errors.name}</FormControl.Feedback>
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

AddChannelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default AddChannelModal;
