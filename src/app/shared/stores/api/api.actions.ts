import actionCreatorFactory from 'typescript-fsa';
import { createEntityAdapter } from '@ngrx/entity';
import { AppStore } from '$shared';

const actionCreator = actionCreatorFactory('api');

/**
 * Api action
 */
export const ApiStoreActions = {
  RESET: actionCreator<null>('RESET'),
  RESET_ERRORS: actionCreator<null>('RESET_ERRORS'),
  RESET_SUCCESS: actionCreator<null>('RESET_SUCCESS'),

  STATE_LOADING: actionCreator<AppStore.ApiResponse>('STATE_LOADING'),
  STATE_MODIFYING: actionCreator<AppStore.ApiResponse>('STATE_MODIFYING'),
  // STATE_ERROR: actionCreator<AppStore.ApiResponse>('STATE_ERROR'),

  STATE_ERROR_GET: actionCreator<AppStore.ApiResponse>('STATE_ERROR_GET'),
  STATE_ERROR_MODIYFING: actionCreator<AppStore.ApiResponse>('STATE_ERROR_MODIYFING'),

  GET_COMPLETE: actionCreator<AppStore.ApiResponse>('GET_COMPLETE'),
  POST_COMPLETE: actionCreator<AppStore.ApiResponse>('POST_COMPLETE'),
  PUT_COMPLETE: actionCreator<AppStore.ApiResponse>('PUT_COMPLETE'),
  UPSERT_COMPLETE: actionCreator<AppStore.ApiResponse>('UPSERT_COMPLETE'),
  DELETE_COMPLETE: actionCreator<AppStore.ApiResponse>('DELETE_COMPLETE'),
};

/**
 * Returns an adapter, initial state and uniqueId for ngrx entity
 * This is necessary to define the unique ID/primary key for each model
 * @param uniqueId - The unique identifier for this model
 */
export const createEntity = <t>(uniqueId: string) => {
  const adapter = createEntityAdapter<t>({ selectId: entity => (<any>entity)[uniqueId] });
  const state = adapter.getInitialState(<AppStore.ApiState<t>>{
    loading: null,
    data: null,
    error: null,
    modifying: null,
    success: null,
  });
  return {
    adapter: adapter,
    initialState: state,
    uniqueId: uniqueId,
  };
};
