import { TastingNote, Tea } from '@app/models';
import { State } from '@app/store';
import { DataState } from '@app/store/reducers/data.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const toMatrix = (tea: Array<Tea>): Array<Array<Tea>> => {
  const matrix: Array<Array<Tea>> = [];
  let row: Array<Tea> = [];
  tea.forEach((t) => {
    row.push(t);
    if (row.length === 4) {
      matrix.push(row);
      row = [];
    }
  });

  if (row.length) {
    matrix.push(row);
  }

  return matrix;
};

export const selectData = createFeatureSelector<DataState>('data');
export const selectTeas = createSelector(selectData, (state: DataState) => state.teas);
export const selectTea = (id: number) =>
  createSelector(selectTeas, (teas: Array<Tea>) => teas.find((t) => t.id === id));
export const selectTeasMatrix = createSelector(selectTeas, (teas: Array<Tea>) => toMatrix(teas));

export const selectNotes = createSelector(selectData, (state: DataState) => state.notes);
export const foo = createSelector;
export const selectNote = (id: number) =>
  createSelector(selectNotes, (notes: Array<TastingNote>) => notes.find((t) => t.id === id));
