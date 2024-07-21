import { useCallback, useState } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Modal } from "./ui/Modal";
import { Spinner } from "./ui/Spinner";

export const HighScore = () => {
  const { query } = useHighScoreApi();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  return (
    <div className="flex items-center">
      <button
        onClick={openModal}
        className="md:text-lg font-bold text-center "
        disabled={query.isFetching || query.isError}
      >
        High Score:<span className="mx-1"></span>
        <Spinner isSpinning={query.isFetching}>
          {query.data?.score ?? "?"}
        </Spinner>
      </button>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <div>
          <p className="md:text-lg ">
            <span>High Score:</span>
            <span className="mx-1">{query.data?.score}</span>
          </p>
          <p className="md:text-lg ">
            <span>User:</span>
            <span className="mx-1">{query.data?.name}</span>
          </p>
          <p className="md:text-lg ">
            <span>On:</span>
            <span className="mx-1">{query.data?.date}</span>
          </p>
        </div>
      </Modal>
    </div>
  );
};
