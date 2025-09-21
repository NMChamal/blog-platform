import {create} from 'zustand';

interface ViewState {
  view: 'grid' | 'list';
  toggleView: () => void;
}

const useViewStore = create<ViewState>()((set) => ({
  view: 'grid',
  toggleView: () => set((state) => ({ view: state.view === 'grid' ? 'list' : 'grid' })),
}));

export default useViewStore;
