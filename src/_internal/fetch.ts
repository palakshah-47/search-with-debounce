import type { IResponse } from '../App';
import mockData from './mock/pokemon.json';

import { state, config } from './state';

const originalFetch = window.fetch;

function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

interface IError {
  error: string;
}

function respond(data: IError | IResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetch(
  input: string,
  options?: RequestInit
): Promise<Response> {
  if (!input.startsWith('search')) {
    return originalFetch(input, options);
  }

  const reqConfig = config[state.step];
  return new Promise(async (resolve, reject) => {
    let isAborted = false;
    if (options?.signal) {
      options.signal.onabort = (ev) => {
        isAborted = true;
        console.log('%cNetwork: ✋ %s', 'color:orange', input);
        resolve(respond({ error: 'Interrupted' }, 400));
      };
    }

    const sleepDuration = Math.round(Math.random() * reqConfig.delay);
    await sleep(sleepDuration); // Delay 0-3s

    if (isAborted) {
      return;
    }

    const shouldFail = Math.random() < reqConfig.errors; // 1 in 4 calls should fail

    if (shouldFail) {
      console.log('%cNetwork: ❌ %s', 'color:red', input);
      return resolve(respond({ error: '¯\\_(ツ)_/¯' }, 500));
    }

    const url = new URL(input, window.location.origin);

    console.log(
      '%cNetwork: 🟢 %s || %dms || %s',
      'color:limegreen',
      input,
      sleepDuration,
      new Date().toISOString().split('T')[1]
    );

    const q = url.searchParams.get('q') || '';
    const limit = parseInt(url.searchParams.get('limit'), 10) || 20;
    const offset = parseInt(url.searchParams.get('offset'), 10) || 0;
    if (q === '') {
      return resolve(
        respond({
          query: q,
          count: 0,
          results: [],
        })
      );
    }

    const allResults = mockData.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
    const results = allResults.slice(offset, offset + limit);

    return resolve(
      respond({
        query: q,
        count: allResults.length,
        results,
      })
    );
  });
}
