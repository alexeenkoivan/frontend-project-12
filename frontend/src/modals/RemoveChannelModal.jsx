import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRemoveChannelMutation } from '../slices/channelsSlice.js';

const RemoveChannelModal = ({ channel, onHide }) => {
  const { t } = useTranslation();
  const [removeChannel] = useRemoveChannelMutation();

  const handleRemove = async () => {
    try {
      await removeChannel(channel.id).unwrap();
      toast.success(t('channels.removed'));
      onHide();
    } catch (err) {
      toast.error(t('errors.toastifyRemove'));
    }
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.confirmation')}</p>
        <div className="d-flex justify-content-end">
          <Button type="button" className="me-2 btn btn-secondary" onClick={onHide}>
            {t('modals.cancel')}
          </Button>
          <Button type="button" className="btn btn-danger" onClick={handleRemove}>
            {t('modals.confirm')}
          </Button>
        </div>
      </Modal.Body>
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
