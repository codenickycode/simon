import { useCallback, useEffect, useState } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Modal } from "./ui/Modal";
import { ANIMATION_DURATION } from "../config";
import { NewHighScore } from "./NewHighScore";

export interface GameOverModalProps {
  isGameOver: boolean;
  userScore: number;
  goToNewGameState: () => void;
}

export const GameOverModal = (props: GameOverModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** This prevents the pads from being triggered by the user typing their name */
  const stopProp = useCallback((e: KeyboardEvent) => e.stopPropagation(), []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    document.addEventListener("keydown", stopProp);
  }, [stopProp]);

  /** To close the modal, use props.goToNewGameState. closeModal will be called
   * in useEffect to respond to the change in game state. This is to prevent
   * complex checks on whether or not to show the modal. */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.removeEventListener("keydown", stopProp);
  }, [stopProp]);

  useEffect(() => {
    if (props.isGameOver && !isModalOpen) {
      openModal();
    }
  }, [isModalOpen, openModal, props.isGameOver]);

  useEffect(() => {
    if (isModalOpen && !props.isGameOver) {
      closeModal();
    }
  }, [closeModal, isModalOpen, props.isGameOver]);

  const [error, setError] = useState("");

  const { query, mutation } = useHighScoreApi({
    onMutationSuccess: props.goToNewGameState,
    onMutationError: (reason: string) => setError(reason),
  });

  const onSubmit = (name: string) => {
    setError("");
    mutation.mutate({ name, score: props.userScore });
  };

  if (!isModalOpen) {
    // reset everything after the modal closes
    setTimeout(() => {
      mutation.reset();
    }, ANIMATION_DURATION);
  }

  const showNewHighScore =
    // if the user has a new high score
    (query.data && props.userScore > query.data.score) ||
    // the line above will be falsy if the user's update to high score is
    // successful (and the query re-validates), so to prevent a "game over"
    // flash, check if their update succeeded
    mutation.data?.success;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={props.goToNewGameState}
      className="max-w-xl"
    >
      {showNewHighScore ? (
        <NewHighScore
          error={error}
          onSubmit={onSubmit}
          // Disable the form while mutation is pending
          disabled={mutation.isPending}
          // Keep a pending state on success because we are animating away the modal. This will prevent a flash.
          pending={mutation.isPending || !!mutation.data?.success}
        />
      ) : (
        <div>GAME OVER</div>
      )}
    </Modal>
  );
};
