import { useCallback, useState } from "react";
import { useHighScoreApi } from "../../services/api.high-score";
import { Spinner } from "../ui-elements/spinner";
import { Modal } from "../ui-elements/modal";
import { CurrentHighScore } from "../shared/current-high-score";
import { Button } from "../ui-elements/button";

export const HighScore = () => {
  const { query } = useHighScoreApi();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  return (
    <div className="flex items-center">
      <Button
        variant="secondary"
        onClick={openModal}
        disabled={query.isFetching || query.isError}
      >
        High Score:<span className="mx-1"></span>
        <Spinner isSpinning={query.isFetching}>
          {query.data?.score ?? "?"}
        </Spinner>
      </Button>
      <Modal isOpen={modalOpen} onClose={closeModal} className="max-w-xl">
        <h2 className="text-xl mb-8">
          🏆 <span className="px-2">High Score</span> 🏆
        </h2>
        <CurrentHighScore highScore={query.data} />
      </Modal>
    </div>
  );
};
