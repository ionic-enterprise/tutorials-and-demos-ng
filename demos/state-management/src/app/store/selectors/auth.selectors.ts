import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '@app/store/reducers/auth.reducer';

export const selectAuth = createFeatureSelector<AuthState>('auth');
export const selectAuthEmail = createSelector(selectAuth, (state: AuthState) => state.user?.email);
export const selectAuthLoading = createSelector(selectAuth, (state: AuthState) => state.loading);
export const selectAuthErrorMessage = createSelector(selectAuth, (state: AuthState) => state.errorMessage);
