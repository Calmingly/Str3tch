import { useLocalStorageState } from './useLocalStorageState';

const KEY = 'str3tch:favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorageState<string[]>(KEY, []);

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return { favoriteIds, isFavorite, toggleFavorite };
}
