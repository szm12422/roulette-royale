import { DiscordSDK } from '@discord/embedded-app-sdk';

/** Connect before allocating WebGL/physics. Standalone previews need no credentials. */
export async function startActivity(startGame: () => void | Promise<void>): Promise<void> {
  const embedded = new URLSearchParams(location.search).has('frame_id') ||
    /(?:^|\.)discordsays\.com$/.test(location.hostname);
  const panel = document.createElement('div');
  panel.setAttribute('role', 'status');
  Object.assign(panel.style, {
    position: 'fixed', inset: '0', zIndex: '10000', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '16px', padding: '24px', textAlign: 'center', color: '#eaf2ff',
    background: '#080e18', font: '16px system-ui',
  });
  panel.textContent = embedded ? 'Discordに接続しています…' : 'ゲームを準備しています…';
  document.body.append(panel);
  let sdk: DiscordSDK | undefined;
  try {
    if (embedded) {
      const clientId: unknown = import.meta.env.VITE_DISCORD_CLIENT_ID;
      if (typeof clientId !== 'string' || !/^\d{17,20}$/.test(clientId)) {
        throw new Error('VITE_DISCORD_CLIENT_IDにApplication IDを設定して再ビルドしてください。');
      }
      sdk = new DiscordSDK(clientId);
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          sdk.ready(),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error('Discordへの接続がタイムアウトしました。アクティビティを開き直してください。')), 15000);
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
      window.addEventListener('pagehide', () => sdk?.close(1000, 'Activity closed'), { once: true });
    }
    panel.textContent = 'ゲームを準備しています…';
    await startGame();
    panel.remove();
  } catch (error) {
    console.error('Activity startup failed', error);
    panel.setAttribute('role', 'alert');
    panel.textContent = error instanceof Error ? error.message : '起動できませんでした。再読み込みしてください。';
    const retry = document.createElement('button');
    retry.textContent = '再読み込み';
    Object.assign(retry.style, { padding: '14px 24px', minHeight: '48px', cursor: 'pointer' });
    retry.addEventListener('click', () => location.reload());
    panel.append(retry);
  }
}
