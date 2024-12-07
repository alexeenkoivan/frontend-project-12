import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeChannel } from '../slices/channelsSlice.js';

const RemoveChannelModal = ({ channel, onHide }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeChannel(channel.id));
    onHide();
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы уверены, что хотите удалить канал «{channel.name}»?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отменить
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

RemoveChannelModal.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
};

export default RemoveChannelModal;
