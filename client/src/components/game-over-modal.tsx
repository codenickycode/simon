import { useState } from 'react';
import { Modal } from './ui.modal';
import { ANIMATION_DURATION } from '../config';
import { NewHighScore } from './game-over-modal.new-high-score';
import { CurrentHighScore } from './shared.current-high-score';
import type {
  GetHighScoreApi,
  UpdateHighScoreApi,
} from '../services/api.high-score';
import { delay } from '../utils/delay';

export interface GameOverModalProps {
  userScore: number;
  isNewHighScore: boolean;
  onModalClose: () => void;
  pausePadKeyListeners: () => () => void;
  getHighScoreApi: GetHighScoreApi;
  updateHighScoreApi: UpdateHighScoreApi;
}

export const GameOverModal = (props: GameOverModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  /** set isModalOpen false to animate out modal, then execute cbs */
  const closeModal = () => {
    setIsModalOpen(false);
    delay(ANIMATION_DURATION, () => {
      props.onModalClose();
      props.updateHighScoreApi.reset();
    });
  };

  const showNewHighScore =
    props.isNewHighScore ||
    // if the user updates the high score isNewHighScore will turn into false
    // after the query re-validates. This means while the modal is animating
    // away it will turn into the Game Over screen again. This is a janky flash,
    // so we will prevent it by keeping the same New High Score screen showing
    // on a mutation success.
    props.updateHighScoreApi.isSuccess;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-xl">
      {showNewHighScore ? (
        <NewHighScore
          newHighScore={props.userScore}
          onMount={props.pausePadKeyListeners}
          updateHighScoreApi={props.updateHighScoreApi}
          closeModal={closeModal}
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
