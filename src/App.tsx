import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import './styles.css';
// import { debounce } from './utils';

interface IPokemon {
  name: string;
  id: string;
  types: Array<string>;
  height: number;
  weight: number;
  sprite: string;
}

export interface IResponse {
  query: string;
  count: number;
  results: Array<IPokemon>;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<IPokemon[]>([]);
  const [loading, setLoading] = useState(false);

  const debounce = (
    callback: (...args1: string[]) => unknown,
    delay: number
  ) => {
    let timeoutId: any;
    return (...args: string[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log(...args);
        callback(...args);
      }, delay);
    };
  };
  const getSuggestions = async (value: string) => {
    setLoading(true);
    try {
      const response = await fetch(`search?q=${query}`);
      const result = await response.json();
      if (Array.isArray(result.results)) {
        setData(result.results);
      } else {
        throw new Error('Invalid suggestions format');
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const onInput =
    // if (!e.target.value) setQuery('');
    debounce((val) => setQuery(val), 1000);
  const debouncedSuggestion = useCallback(debounce(getSuggestions, 1000), []);

  useEffect(() => {
    // debouncedSuggestion(query);
    getSuggestions(query);
  }, [query]);

  return (
    <div className="app">
      <input
        type="text"
        placeholder="Search (e.g. pikachu, meta)"
        // value={query}
        onInput={(e: ChangeEvent<HTMLInputElement>) => onInput(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      {!loading && !query && <div>Type something to search</div>}
      <hr />
      {data && data && data.length ? (
        <>
          <div>Search for {data.length} results found</div>
          <ul>
            {data.map((pokemon) => (
              <li key={pokemon.id}>
                <img src={pokemon.sprite} alt={pokemon.name} />
                <h3>{pokemon.name}</h3>
                <p>Types: {pokemon.types.join(', ')}</p>
                <p>Height: {pokemon.height}</p>
                <p>Weight {pokemon.weight}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {data && query && !data?.length && !loading && <div>No results</div>}
    </div>
  );
}

