import { useCallback, useEffect, useState } from 'react';
import { Modal } from './ui.modal';
import { ANIMATION_DURATION } from '../config';
import { NewHighScore } from './game-over-modal.new-high-score';
import { CurrentHighScore } from './shared.current-high-score';
import type { GetHighScoreApi } from '../services/api.high-score';
import { useUpdateHighScoreApi } from '../services/api.high-score';
import { delay } from '../utils/delay';

export interface GameOverModalProps {
  userScore: number;
  getHighScoreApi: GetHighScoreApi;
  isNewHighScore: boolean;
  onModalClose: () => void;
  padKeyListeners: { pause: () => void; resume: () => void };
}

export const GameOverModal = (props: GameOverModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  // pause pad key listeners on mount
  useEffect(() => {
    props.padKeyListeners.pause();
  }, [props.padKeyListeners]);

  /** set isModalOpen false to animate out modal, then execute cbs */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    delay(ANIMATION_DURATION, () => {
      props.padKeyListeners.resume();
      props.onModalClose();
    });
  }, [props]);

  const updateHighScoreApi = useUpdateHighScoreApi({
    onSuccess: closeModal,
    onError: (reason: string) => setError(reason),
  });

  // reset mutation client state after the modal closes
  useEffect(() => {
    return () => {
      setTimeout(() => {
        updateHighScoreApi.reset();
      }, ANIMATION_DURATION);
    };
  }, [updateHighScoreApi]);

  const [error, setError] = useState('');

  const onSubmit = (name: string) => {
    setError('');
    updateHighScoreApi.mutate({ name, score: props.userScore });
  };

  const showNewHighScore =
    props.isNewHighScore ||
    // the line above will be falsy if the user's update to high score is
    // successful (and the query re-validates), so to prevent a "game over"
    // flash, check if their update succeeded
    updateHighScoreApi.isSuccess;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-xl">
      {showNewHighScore ? (
        <NewHighScore
          error={error}
          onSubmit={onSubmit}
          // Disable the form while mutation is pending
          disabled={updateHighScoreApi.isPending}
          pending={
            // Keep a pending state on success because we are animating away the modal. This will prevent a flash.
            updateHighScoreApi.isPending || !!updateHighScoreApi.isSuccess
          }
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
