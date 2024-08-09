import { useCallback, useState } from 'react';
import { Spinner } from '../ui-elements/spinner';
import { Modal } from '../ui-elements/modal';
import { CurrentHighScore } from '../shared/current-high-score';
import { Button } from '../ui-elements/button';
import type { GetHighScoreApi } from '../../services/api.high-score';

export const HighScore = ({
  getHighScoreApi,
}: {
  getHighScoreApi: GetHighScoreApi;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  return (
    <div className="flex items-center">
      <Button
        variant="secondary"
        onClick={openModal}
        disabled={getHighScoreApi.isFetching}
      >
        High Score:<span className="mx-1"></span>
        <Spinner isSpinning={getHighScoreApi.isFetching}>
          {getHighScoreApi.data?.score ?? '?'}
        </Spinner>
      </Button>
      <Modal isOpen={modalOpen} onClose={closeModal} className="max-w-xl">
        <h2 className="text-xl mb-8">
          🏆 <span className="px-2">High Score</span> 🏆
        </h2>
        <CurrentHighScore highScore={getHighScoreApi.data} />
      </Modal>
    </div>
  );
};
