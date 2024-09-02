import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Input } from './ui.input';
import { Button } from './ui.button';
import { Spinner } from './ui.spinner';
import { type UpdateHighScoreApi } from '../services/api.high-score';

interface NewHighScoreProps {
  newHighScore: number;
  onMount: () => () => void;
  updateHighScoreApi: UpdateHighScoreApi;
  closeModal: () => void;
}

export const NewHighScore = ({
  newHighScore,
  onMount,
  updateHighScoreApi,
  closeModal,
}: NewHighScoreProps) => {
  useEffect(() => {
    const onUnMount = onMount();
    return onUnMount;
  }, [onMount]);

  const [userName, setUserName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateHighScoreApi.mutate(
      { name: userName, score: newHighScore },
      { onSuccess: closeModal },
    );
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">
        High Score!
        <span className="ml-3">🚀 🚀 🚀</span>
      </h2>
      <p className="text-balance text-sm mb-4">
        Congrats! You have the new high score. Enter your name for the global
        scoreboard:
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          disabled={updateHighScoreApi.isPending}
          className="mr-2 mb-2"
          maxLength={48}
        />
        <Button type="submit" disabled={updateHighScoreApi.isPending}>
          <Spinner isSpinning={updateHighScoreApi.isPending}>
            <span className="font-bold">save</span>
          </Spinner>
        </Button>
        {updateHighScoreApi.error ? (
          <pre className="mt-3 text-red-500 text-sm text-balance whitespace-pre-wrap">
            {formatUpdateError(updateHighScoreApi.error.message)}
          </pre>
        ) : null}
      </form>
    </div>
  );
};

function formatUpdateError(message: string): string {
  if (message === 'Failed to fetch') {
    return 'Unable to update high score.\nPlease check your connection and try again.';
  }
  return message;
}
