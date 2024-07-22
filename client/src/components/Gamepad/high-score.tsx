import { useCallback, useState } from "react";
import { useHighScoreApi } from "../../services/api.high-score";
import { Spinner } from "../ui-elements/spinner";
import { Modal } from "../ui-elements/modal";
import { CurrentHighScore } from "../shared/current-high-score";

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
      <Modal isOpen={modalOpen} onClose={closeModal} className="max-w-xl">
        <CurrentHighScore highScore={query.data} />
      </Modal>
    </div>
  );
};
