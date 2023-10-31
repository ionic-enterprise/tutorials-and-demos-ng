import { AuthState, reducer as authReducer } from './auth.reducer';
import { DataState, reducer as dataReducer } from './data.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

export interface State {
  auth: AuthState;
  data: DataState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  data: dataReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
