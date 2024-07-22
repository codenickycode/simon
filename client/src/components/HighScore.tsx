import { useCallback, useState } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Modal } from "./ui/Modal";
import { Spinner } from "./ui/Spinner";
import { formatDate } from "../utils/date";

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
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col space-y-3">
                <div>
                  <h3 className="text-sm text-slate-400">Score</h3>
                  <p className="mt-1 md:text-lg font-semibold ">
                    {query.data?.score}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Name</h3>
                  <p className="mt-1 md:text-lg  break-words">
                    {query.data?.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Date</h3>
                  <p className="mt-1 md:text-lg ">
                    {formatDate(query.data?.timestamp ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
