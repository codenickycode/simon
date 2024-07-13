import { FormEvent, useCallback, useEffect, useState } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { ANIMATION_DURATION } from "../const";

export interface HighScoreProps {
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
    if (query.data && query.data.score < props.userScore) {
      openModal();
    }
  }, [openModal, props.userScore, query.data]);

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
    <div>
      <button onClick={openModal}>open modal</button>
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
