import type { CombinedDataset, Snapshot } from '../../types';

const STORAGE_KEY = 'pgd_dataset';
const SNAPSHOTS_KEY = 'pgd_snapshots';

export const storage = {
  saveDataset: (dataset: CombinedDataset): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
  },
  
  loadDataset: (): CombinedDataset | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveSnapshots: (snapshots: Snapshot[]): void => {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
  },

  loadSnapshots: (): Snapshot[] => {
    const data = localStorage.getItem(SNAPSHOTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  resetData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SNAPSHOTS_KEY);
  }
};
