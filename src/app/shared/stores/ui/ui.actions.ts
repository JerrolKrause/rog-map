import actionCreatorFactory from 'typescript-fsa';
import { AppStore } from '$shared';

const actionCreator = actionCreatorFactory('ui');

export const UIStoreActions = {
  GRID_STATE_CHANGE: actionCreator<GridState>('GRID_STATE_CHANGE'),
  RESET: actionCreator<null>('RESET'),
  REHYDRATE: actionCreator<AppStore.Ui>('REHYDRATE'),
  MODAL_OPEN: actionCreator<{
    modalId: string;
    options: { size: 'sm' | 'lg' | 'xl' | 'full' };
    data: any;
  }>('MODAL_OPEN'),
  MODAL_UNLOAD: actionCreator<null>('MODAL_UNLOAD'),
  TAB_CHANGE: actionCreator<{ tabInstanceId: string; tabId: number }>('TAB_CHANGE'),
  TOGGLES: actionCreator<AppStore.Toggles>('TOGGLES'),
  // SIDEBAR_TOGGLE: actionCreator<boolean>('SIDEBAR_TOGGLE'),
  // MULTISCREEN_TOGGLE: actionCreator<boolean | null>('MULTISCREEN_TOGGLE'),
};
