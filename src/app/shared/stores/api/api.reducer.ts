import { ApiStoreActions } from './api.actions';
// import { ApiUtils } from '$utils';
import { AppStore } from '../store';

import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

export function ApiReducer(state: AppStore.Api = {}, action: Action) {
  // console.log('ApiReducer', action, ApiStoreActions);

  if (isType(action, ApiStoreActions.RESET)) {
    state = {};
  }

  // Loading
  if (isType(action, ApiStoreActions.STATE_LOADING)) {
    state[action.payload.apiMap.storeProperty] = {
      ...action.payload.apiMap.entity.initialState,
      ...state[action.payload.apiMap.storeProperty],
      loading: true,
      error: false,
    };
  }

  // Modifying, IE put, post or delete
  if (isType(action, ApiStoreActions.STATE_MODIFYING)) {
    state[action.payload.apiMap.storeProperty] = {
      ...action.payload.apiMap.entity.initialState,
      ...state[action.payload.apiMap.storeProperty],
      modifying: true,
      errorModifying: false,
      success: false,
    };
  }

  // On error, either from loading or modifying
  if (isType(action, ApiStoreActions.STATE_ERROR_GET)) {
    state[action.payload.apiMap.storeProperty] = {
      ...action.payload.apiMap.entity.initialState,
      ...state[action.payload.apiMap.storeProperty],
      loading: false,
      error: action.payload.data,
    };
  }

  // On error, either from loading or modifying
  if (isType(action, ApiStoreActions.STATE_ERROR_MODIYFING)) {
    state[action.payload.apiMap.storeProperty] = {
      ...action.payload.apiMap.entity.initialState,
      ...state[action.payload.apiMap.storeProperty],
      modifying: false,
      errorModifying: action.payload.data,
      success: false,
    };
  }

  /*
  * Get complete
  */
  if (isType(action, ApiStoreActions.GET_COMPLETE)) {
    // If response is an array/collection and has an entityAdapter, convert to ngrx entities
    if (Array.isArray(action.payload.data) && typeof action.payload.data === 'object' && action.payload.apiMap.entity) {
      // Ensure initial state is set and current state is merged down on top of that
      state[action.payload.apiMap.storeProperty] = {
        ...action.payload.apiMap.entity.initialState,
        ...state[action.payload.apiMap.storeProperty],
      };
      // After successful get, clear out all data currently in this store
      state[action.payload.apiMap.storeProperty] = action.payload.apiMap.entity.adapter.removeAll();
      // Update record/s in collection
      state[action.payload.apiMap.storeProperty] = action.payload.apiMap.entity.adapter.addMany(
        action.payload.data,
        state[action.payload.apiMap.storeProperty],
      );
      // After update, get new array and set to data property
      state[action.payload.apiMap.storeProperty].data = action.payload.apiMap.entity.adapter
        .getSelectors()
        .selectAll(state[action.payload.apiMap.storeProperty]);
    } else {
      // For all other types of data, load straight into data property
      state[action.payload.apiMap.storeProperty].data = action.payload.data;
    }

    // Set load complete state
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty],
      loading: false,
      error: false,
    };
  }

  /*
  * Post, put and upsert complete
  */
  if (
    isType(action, ApiStoreActions.POST_COMPLETE) ||
    isType(action, ApiStoreActions.PUT_COMPLETE) ||
    isType(action, ApiStoreActions.UPSERT_COMPLETE)
  ) {
    // If the destination is an ngrx entity type
    if (state[action.payload.apiMap.storeProperty].entities) {
      // If response is a collection, use addMany
      if (Array.isArray(action.payload.data) && typeof action.payload.data === 'object') {
        state[action.payload.apiMap.storeProperty] = action.payload.apiMap.entity.adapter.upsertMany(
          action.payload.data,
          state[action.payload.apiMap.storeProperty],
        );
      } else {
        // If response is a single object, use addOne
        state[action.payload.apiMap.storeProperty] = action.payload.apiMap.entity.adapter.upsertOne(
          action.payload.data,
          state[action.payload.apiMap.storeProperty],
        );
      }
      // After update, get new array and set to data property
      state[action.payload.apiMap.storeProperty].data = action.payload.apiMap.entity.adapter
        .getSelectors()
        .selectAll(state[action.payload.apiMap.storeProperty]);
    } else {
      // All other types, send repsonse straight to data property
      state[action.payload.apiMap.storeProperty].data = action.payload.data;
    }

    // Set state
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty],
      loading: false,
      error: false,
      modifying: false,
      success: true,
    };
  }

  /*
  * Delete complete
  */
  if (isType(action, ApiStoreActions.DELETE_COMPLETE)) {
    // If the destination is an ngrx entity type
    if (state[action.payload.apiMap.storeProperty].entities) {
      // If response is a collection, use addMany
      if (Array.isArray(action.payload.data) && typeof action.payload.data === 'object') {
        // Get array of unique IDs for delete collection
        const deleteIds = action.payload.data.reduce((a, b) => [...a, b[action.payload.apiMap.entity.uniqueId]], []);
        // If response is a collection, use removeMany
        state[action.payload.apiMap.storeProperty] = action.payload.apiMap.entity.adapter.removeMany(
          deleteIds,
          state[action.payload.apiMap.storeProperty],
        );
      } else {
        // If response is a single object, use removeOne
        state[action.payload.apiMap.storeProperty] = action.payload.apiMap.entity.adapter.removeOne(
          action.payload.data[action.payload.apiMap.entity.uniqueId],
          state[action.payload.apiMap.storeProperty],
        );
      }
      // After update, get new array and set to data property
      state[action.payload.apiMap.storeProperty].data = action.payload.apiMap.entity.adapter
        .getSelectors()
        .selectAll(state[action.payload.apiMap.storeProperty]);
    } else {
      // All other types, send repsonse straight to data property
      state[action.payload.apiMap.storeProperty].data = action.payload.data;
    }

    // Update State
    state[action.payload.apiMap.storeProperty] = {
      ...state[action.payload.apiMap.storeProperty],
      loading: false,
      error: false,
      modifying: false,
      success: true,
    };
  }

  return state;
}
