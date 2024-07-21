import { FormEvent, useCallback, useEffect, useState } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Modal } from "./ui/Modal";
import { Spinner } from "./ui/Spinner";
import { ANIMATION_DURATION } from "../config";

export interface HighScoreProps {
  isGameOver: boolean;
  userScore: number;
}

export const HighScore = (props: HighScoreProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const { query, mutation } = useHighScoreApi({
    onMutationSuccess: closeModal,
  });

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (
      props.isGameOver && // 🙂
      query.data && // 😅
      query.data.score < props.userScore && // 😰
      !isModalOpen && // 🥵
      mutation.isIdle // 😭
    ) {
      openModal();
    }
  }, [
    isModalOpen,
    mutation.isIdle,
    openModal,
    props.isGameOver,
    props.userScore,
    query.data,
  ]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ name: userName, score: props.userScore });
  };

  if (!isModalOpen && !mutation.isIdle) {
    // reset everything after the modal closes
    setTimeout(() => {
      mutation.reset();
      setUserName("");
    }, ANIMATION_DURATION);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2">
        <span className="font-bold">High Score:</span>
        <Spinner isSpinning={query.isFetching}>{query.data?.score}</Spinner>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>🎉 Congrats! 🥳</h2>
        <p>You have the new high score!</p>
        <form onSubmit={onSubmit}>
          <input
            autoFocus={isModalOpen}
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            disabled={mutation.isPending}
          />
          <button type="submit" disabled={mutation.isPending}>
            {/* Keep spinning on isSuccess because we are animating away the modal. This will prevent a flash. */}
            <Spinner isSpinning={mutation.isPending || mutation.isSuccess}>
              Submit
            </Spinner>
          </button>
        </form>
      </Modal>
    </div>
  );
};
