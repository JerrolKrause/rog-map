/**
Adding a new endpoints:
1. Create a new property in the ApiProps enum in api.actions.ts
2. Create a new entry in this api.map. Add endpoint, store property and entity
3. Add the end data location in the main store state in api.store.service.ts
*/

import { ApiProps } from './api.props';
import { createEntity } from './api.actions';
import { Models } from '$models';
// import { environment } from '$env';

export const ApiMap = {
  // Users Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    // endpoint: environment.endpoints.apiUrl + '/users'
    storeProperty: ApiProps.users,
    entity: createEntity<Models.User>('id'),
  },
};
