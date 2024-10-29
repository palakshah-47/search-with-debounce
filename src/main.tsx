import { createRoot } from 'react-dom/client';

import App from './App';

import { fetch as mockFetch } from './_internal/fetch';
import { state } from './_internal/state';

window.fetch = mockFetch;

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    // @ts-ignore
    <div>
      <div
        style={{
          margin: '-8px',
          marginBottom: '8px',
          padding: '8px',
          background: '#ddd',
          fontFamily: 'Arial',
        }}
      >
        Task:{' '}
        <select
          defaultValue={state.step}
          onChange={(el) => {
            state.step = parseInt(el.target.value, 10);
            try {
              localStorage.setItem('step', state.step.toString());
            } catch {}
          }}
        >
          <option value="1">1: Extra labels</option>
          <option value="2">2: Wrong query</option>
          <option value="3">3: Slow typing</option>
          <option value="4">4: Slow server</option>
          <option value="5">5: Errors</option>
          <option value="6">6: Misc</option>
        </select>
      </div>
      <App />
    </div>
  );
}
