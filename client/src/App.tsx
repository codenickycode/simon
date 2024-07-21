import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gamepad } from "./components/Gamepad/Gamepad";
import { useGameMachine } from "./services/game-machine";
import { HighScore } from "./components/HighScore";
import { Button } from "./components/ui/Button";
import { GameOverModal } from "./components/GameOver";

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-sans text-slate-200 overflow-hidden fixed h-dvh w-full touch-none bg-gradient-to-b from-slate-700 to-sky-950 flex items-center justify-center">
        <main className="w-full h-full flex flex-col landscape:flex-row max-w-screen-xl items-center justify-evenly">
          <GameOverModal
            isGameOver={gameMachine.isGameOver}
            userScore={gameMachine.userScore}
            goToNewGameState={() =>
              gameMachine.actions.transition({ to: "newGame" })
            }
          />
          <div className="h-24 landscape:h-auto w-full flex items-center justify-center">
            {(gameMachine.isGameOver || gameMachine.isNewGame) && <HighScore />}
          </div>
          <div>
            <Gamepad
              isPlaying={gameMachine.isPlaying}
              isUserTurn={gameMachine.isUserTurn}
              onUserPadDown={gameMachine.actions.input}
              currentScore={gameMachine.currentScore}
            />
          </div>
          <div className="h-24 landscape:h-auto w-full flex items-center justify-center">
            {(gameMachine.isGameOver || gameMachine.isNewGame) && (
              <Button onClick={gameMachine.actions.startNewGame}>
                <span className="text-xl md:text-2xl font-bold">start</span>
              </Button>
            )}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
