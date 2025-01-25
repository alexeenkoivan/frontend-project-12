import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Modal, Button, FormControl, FormGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../slices/channelsSlice.js';

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
        .min(3, 'Имя канала должно содержать от 3 до 20 символов')
        .max(20, 'Имя канала должно содержать от 3 до 20 символов')
        .notOneOf(channels.map((channel) => channel.name), 'Имя канала должно быть уникальным')
        .required('Обязательное поле'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(addChannel({ name: values.name }));
      resetForm();
      onHide();
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
