import { FormEvent, useCallback, useEffect, useState } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Modal } from "./ui/Modal";
import { Spinner } from "./ui/Spinner";
import { ANIMATION_DURATION } from "../config";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export interface HighScoreProps {
  isGameOver: boolean;
  userScore: number;
  goToNewGameState: () => void;
}

export const GameOverModal = (props: HighScoreProps) => {
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
  const [userName, setUserName] = useState("");

  const { query, mutation } = useHighScoreApi({
    onMutationSuccess: props.goToNewGameState,
    onMutationError: (reason: string) => setError(reason),
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    mutation.mutate({ name: userName, score: props.userScore });
  };

  if (!isModalOpen && !mutation.isIdle) {
    // reset everything after the modal closes
    setTimeout(() => {
      mutation.reset();
      setUserName("");
      setError("");
    }, ANIMATION_DURATION);
  }

  const showNewHighScore =
    // if the user has a new high score
    (query.data && props.userScore > query.data.score) ||
    // the line above will be falsy if the user's update to high score is
    // successful, so to prevent a "game over" flash, check if their update
    // succeeded
    mutation.data?.success;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={props.goToNewGameState}
      className="max-w-xl"
    >
      {showNewHighScore ? (
        <div>
          <h2 className="text-2xl mb-4">
            High Score!
            <span className="ml-3">🚀 🚀 🚀</span>
          </h2>
          <p className="text-balance text-sm mb-4">
            Congrats! You have the new high score. Enter your name for the
            global scoreboard:
          </p>
          <form onSubmit={onSubmit}>
            <Input
              autoFocus={isModalOpen}
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              disabled={mutation.isPending}
              className="mr-2"
              maxLength={48}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {/* Keep spinning on success because we are animating away the modal. This will prevent a flash. */}
              <Spinner
                isSpinning={mutation.isPending || !!mutation.data?.success}
              >
                <span className="font-bold">save</span>
              </Spinner>
            </Button>
            {error ? (
              <pre className="mt-3 text-red-500 text-sm text-balance whitespace-pre-wrap">
                {error}
              </pre>
            ) : null}
          </form>
        </div>
      ) : (
        <div>GAME OVER</div>
      )}
    </Modal>
  );
};
