import { useMemo } from 'react';
import { ROUTINES } from '../data/routines';
import { useCustomRoutines } from './useCustomRoutines';

export function useAllRoutines() {
  const { customRoutines, save, remove } = useCustomRoutines();

  const all = useMemo(() => [...ROUTINES, ...customRoutines], [customRoutines]);
  const getById = (id: string) => all.find((r) => r.id === id);

  return { all, getById, customRoutines, saveCustom: save, removeCustom: remove };
}
