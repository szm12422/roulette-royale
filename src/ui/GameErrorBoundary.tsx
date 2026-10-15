import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

export default class GameErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error): void {
    console.error('Game rendering failed', error)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div
        role="alert"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          color: '#eaf2ff',
          background: '#080e18',
          font: '16px system-ui',
        }}
      >
        <p>ゲームを表示できませんでした。WebGLを有効にして、再読み込みしてください。</p>
        <button
          type="button"
          onClick={() => location.reload()}
          style={{ padding: '14px 24px', minHeight: 48, cursor: 'pointer' }}
        >
          再読み込み
        </button>
      </div>
    )
  }
}
