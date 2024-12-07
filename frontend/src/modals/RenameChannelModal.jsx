import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormControl, FormGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../slices/channelsSlice.js';

const RenameChannelModal = ({ channel, onHide }) => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const inputRef = useRef();

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Имя канала должно содержать от 3 до 20 символов')
        .max(20, 'Имя канала должно содержать от 3 до 20 символов')
        .notOneOf(channels.map((ch) => ch.name), 'Имя канала должно быть уникальным')
        .required('Обязательное поле'),
    }),
    onSubmit: (values) => {
      dispatch(renameChannel({ id: channel.id, name: values.name }));
      onHide();
    },
  });

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              name="name"
              placeholder="Введите новое имя канала"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <FormControl.Feedback type="invalid">{formik.errors.name}</FormControl.Feedback>
          </FormGroup>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Отменить
            </Button>
            <Button type="submit" variant="primary">
              Отправить
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
