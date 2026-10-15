import { useState } from 'react'
import { PAYOUTS } from '../game/bets.ts'
import { formatCredits } from './Hud.tsx'
import type { BetKind } from '../game/types.ts'
import type { CameraView } from '../render/engineApi.ts'

interface MenuProps {
  /** A saved session exists (this run or a previous visit); shows "Continue" instead of "Play". */
  hasSave: boolean
  savedBankroll: number
  muted: boolean
  quickSpin: boolean
  cameraView: CameraView
  onPlay: () => void
  onToggleMute: () => void
  onToggleQuickSpin: () => void
  onCycleCamera: () => void
  onResetCredits: () => void
}

const CAMERA_LABEL: Record<CameraView, string> = { auto: '自動', table: 'テーブル', wheel: 'ルーレット', overhead: '俯瞰' }

/** One row of the payout table, grouping the outside bets that all pay the same 1 to 1. */
const PAYOUT_ROWS: { kind: BetKind; label: string }[] = [
  { kind: 'straight', label: 'ストレート · 1つの数字' },
  { kind: 'split', label: 'スプリット · 2つの数字' },
  { kind: 'street', label: 'ストリート · 3つの数字' },
  { kind: 'trio', label: 'トリオ · 0と2つの数字' },
  { kind: 'corner', label: 'コーナー · 4つの数字' },
  { kind: 'firstFour', label: 'ファーストフォー · 0、1、2、3' },
  { kind: 'sixLine', label: 'シックスライン · 6つの数字' },
  { kind: 'column', label: '列 · 12の数字' },
  { kind: 'dozen', label: 'ダズン · 12の数字' },
  { kind: 'red', label: '赤・黒、奇数・偶数、1～18・19～36' },
]

/** One row of the keyboard legend, matching the bindings in `App.tsx`. */
const KEYBOARD_LEGEND: { label: string; keys: string }[] = [
  { label: 'スピン', keys: 'Space / Enter' },
  { label: 'チップの額', keys: '1 – 5' },
  { label: '取り消す', keys: 'Z / Backspace' },
  { label: 'ベットを消す', keys: 'X / Delete' },
  { label: '前回と同じベット', keys: 'R' },
  { label: 'ベットを倍にする', keys: 'D' },
  { label: 'カメラ', keys: 'C' },
  { label: '高速スピン', keys: 'Q' },
  { label: 'ミュート', keys: 'M' },
  { label: 'メニュー', keys: 'Esc' },
]

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path d="m16 9 5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function UnmuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * The art-deco title screen: a docked panel on wide screens (so attract mode stays visible on
 * the table behind it) or a bottom sheet on phones. Play/Continue, an expandable how-to-play
 * with the payout table and keyboard legend, settings toggles, a reset-credits control with an
 * inline confirm, and the no-real-money footer.
 */
export default function Menu({
  hasSave,
  savedBankroll,
  muted,
  quickSpin,
  cameraView,
  onPlay,
  onToggleMute,
  onToggleQuickSpin,
  onCycleCamera,
  onResetCredits,
}: MenuProps) {
  const [howToOpen, setHowToOpen] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleResetClick() {
    if (confirmingReset) {
      setConfirmingReset(false)
      onResetCredits()
    } else {
      setConfirmingReset(true)
    }
  }

  return (
    <div className="menu-screen">
      <div className="menu-panel felt-panel">
        <div className="menu-top-row">
          <div className="bulb-border">
            <h1 className="menu-title">Roulette Royale</h1>
          </div>
        </div>
        <p className="menu-tagline">ヨーロピアンルーレット（ゼロは1つ）</p>

        <button type="button" className="primary-button play-button" onClick={onPlay}>
          {hasSave ? `続きから — ${formatCredits(savedBankroll)} クレジット` : 'プレイ'}
        </button>

        <section className="panel-section">
          <button
            type="button"
            className="panel-heading panel-heading-toggle"
            aria-expanded={howToOpen}
            onClick={() => setHowToOpen((open) => !open)}
          >
            遊び方 {howToOpen ? '−' : '+'}
          </button>
          {howToOpen && (
            <div className="how-to-body">
              <p className="how-to-line">
                テーブルをタップまたはクリックしてチップを置きます。右クリックまたはチップの長押しで取り除けます。
              </p>
              <table className="payout-table">
                <tbody>
                  {PAYOUT_ROWS.map((row) => (
                    <tr key={row.kind}>
                      <td className="payout-label">{row.label}</td>
                      <td className="payout-value">{PAYOUTS[row.kind]}対1</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="how-to-line">ハウスエッジ：2.7%</p>
              <dl className="legend-list pointer-only">
                {KEYBOARD_LEGEND.map((row) => (
                  <div className="legend-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.keys}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        <section className="panel-section" aria-label="設定">
          <h2 className="panel-heading">設定</h2>
          <div className="settings-row">
            <span className="settings-label">高速スピン</span>
            <button
              type="button"
              className="toggle-switch"
              role="switch"
              aria-checked={quickSpin}
              aria-label="高速スピン"
              onClick={onToggleQuickSpin}
            >
              <span className="toggle-knob" />
            </button>
          </div>
          <div className="settings-row">
            <span className="settings-label">サウンド</span>
            <button
              type="button"
              className="icon-button"
              aria-label={muted ? 'ミュートを解除' : 'ミュート'}
              onClick={onToggleMute}
            >
              {muted ? <MuteIcon /> : <UnmuteIcon />}
            </button>
          </div>
          <div className="settings-row">
            <span className="settings-label">カメラ</span>
            <button type="button" className="secondary-button settings-camera" onClick={onCycleCamera}>
              {CAMERA_LABEL[cameraView]}
            </button>
          </div>
        </section>

        <section className="panel-section">
          {confirmingReset ? (
            <div className="reset-confirm-row">
              <span className="settings-label">1,000クレジットにリセットしますか？</span>
              <button type="button" className="secondary-button" onClick={handleResetClick}>
                確認
              </button>
              <button type="button" className="secondary-button" onClick={() => setConfirmingReset(false)}>
                キャンセル
              </button>
            </div>
          ) : (
            <button type="button" className="secondary-button" onClick={handleResetClick}>
              クレジットをリセット
            </button>
          )}
        </section>

        <p className="menu-footer">ゲーム内クレジット専用です。現金や課金はありません。</p>
      </div>
    </div>
  )
}
