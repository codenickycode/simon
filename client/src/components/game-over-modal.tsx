import { useCallback, useState } from 'react';
import { Modal } from './ui.modal';
import { ANIMATION_DURATION } from '../config';
import { NewHighScore } from './game-over-modal.new-high-score';
import { CurrentHighScore } from './shared.current-high-score';
import type { GetHighScoreApi } from '../services/api.high-score';
import { delay } from '../utils/delay';

export interface GameOverModalProps {
  userScore: number;
  getHighScoreApi: GetHighScoreApi;
  isNewHighScore: boolean;
  onModalClose: () => void;
  pausePadKeyListeners: () => () => void;
}

export const GameOverModal = (props: GameOverModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  /** set isModalOpen false to animate out modal, then execute cbs */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    delay(ANIMATION_DURATION, () => {
      props.onModalClose();
    });
  }, [props]);

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-xl">
      {props.isNewHighScore ? (
        <NewHighScore
          newHighScore={props.userScore}
          onUpdateSuccess={closeModal}
          onMount={props.pausePadKeyListeners}
        />
      ) : (
        <div>
          <h3 className="font-bold mb-1 text-xl">💥 GAME OVER 💥</h3>
          <p className="mb-4">
            Your score is {props.userScore}. Try again to beat the global high
            score!
          </p>
          <CurrentHighScore getHighScoreApi={props.getHighScoreApi} />
        </div>
      )}
    </Modal>
  );
};
