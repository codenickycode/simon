import { test, expect } from '@playwright/test';

test.use({
  actionTimeout: 5000,
  // add a user agent so server doesn't think playwright is a bot 🤖
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
});

test.beforeEach(async () => {
  try {
    await fetch('http://localhost:8788/test/reset', { method: 'POST' });
    console.log('Successfully reset test db');
  } catch (error) {
    console.error('Failed to reset test db', error);
  }
});

test('e2e', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Simon/);

  const greenPad = page.getByLabel('green pad');
  const redPad = page.getByLabel('red pad');
  const bluePad = page.getByLabel('blue pad');
  const yellowPad = page.getByLabel('yellow pad');

  const highScoreBtn = page.getByRole('button', { name: 'High Score' });
  await expect(highScoreBtn).toHaveText('High Score:0');

  const startBtn = page.getByRole('button', { name: 'start' });
  startBtn.click();

  // green pad should play first, cycling through brightness
  await page.waitForSelector('button[aria-label="green pad"].brightness-100', {
    state: 'visible',
  });
  await page.waitForSelector('button[aria-label="green pad"].brightness-100', {
    state: 'detached',
  });

  const userScore = page.getByLabel('user score');
  await expect(userScore).toHaveText('0');
  await expect(yellowPad).toHaveText('a');
  // once we see user score and pad char, it's the user's turn

  // the client checks env.E2E for random index generation to cycle instead
  // which means the pads will cycle green->red->blue->yellow->green etc...

  // let's first click the wrong pad and get a loser screen
  yellowPad.click();

  // game over modal displays
  await page.waitForSelector('h3:has-text("💥 GAME OVER 💥")', {
    state: 'visible',
  });
  expect(
    page.getByText('Your score is 0. Try again to beat the global high score!'),
  ).toBeVisible();

  // close the modal
  await page.keyboard.press('Escape');
  await page.waitForSelector('h3:has-text("💥 GAME OVER 💥")', {
    state: 'detached',
  });

  // now let's beat the high score
  startBtn.click();

  // red pad should play first, cycling through brightness
  await page.waitForSelector('button[aria-label="red pad"].brightness-100', {
    state: 'visible',
  });
  await page.waitForSelector('button[aria-label="red pad"].brightness-100', {
    state: 'detached',
  });

  await expect(userScore).toHaveText('0');
  await expect(redPad).toHaveText('w');
  // once we see user score and pad char, it's the user's turn

  // click the correct color
  redPad.click();
  await page.waitForSelector('button[aria-label="red pad"].brightness-100', {
    state: 'visible',
  });
  await page.waitForSelector('button[aria-label="red pad"].brightness-100', {
    state: 'detached',
  });

  await expect(userScore).toHaveText('1');

  // next, the computer will play red,blue
  // then reset current score to 0, indicating user's turn
  await expect(userScore).toHaveText('0');

  // let's use keyboard this time
  await expect(redPad).toHaveText('w');

  page.keyboard.press('KeyW');

  await expect(userScore).toHaveText('1');

  // and now let's click the wrong pad (should be blue: KeyS)
  page.keyboard.press('KeyA');

  // new high score modal displays
  await page.waitForSelector('h2:has-text("High Score!")', {
    state: 'visible',
  });
  expect(
    page.getByText(
      'Congrats! You have the new high score. Enter your name for the global scoreboard:',
    ),
  ).toBeVisible();

  page.getByPlaceholder('Enter your name').fill('Bob');

  page.getByRole('button', { name: 'save' }).click();

  // new high score modal is removed
  await page.waitForSelector('h2:has-text("High Score!")', {
    state: 'detached',
    timeout: 5000,
  });

  await expect(highScoreBtn).toHaveText('High Score:1');

  highScoreBtn.click();

  // current high score modal displays
  await page.waitForSelector('h2:has-text("🏆 High Score 🏆")', {
    state: 'visible',
  });

  expect(page.getByText('Bob')).toBeVisible();
});
