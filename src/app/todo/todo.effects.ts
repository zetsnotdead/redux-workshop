import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { TodoService } from './todo.service';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private todosService: TodoService) {}

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.remove),
      mergeMap(({ id }) =>
        this.todosService.remove(id).pipe(
          map(() => TodoActions.removeSuccess({ id })),
          catchError(err =>
            of(TodoActions.removeError({ id, message: err.message }))
          )
        )
      )
    )
  );

  toggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggle),
      mergeMap(({ id }) =>
        this.todosService.toggle(id).pipe(
          map(() => TodoActions.toggleSuccess({ id })),
          catchError(err =>
            of(TodoActions.toggleError({ id, message: err.message }))
          )
        )
      )
    )
  );

  errors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.removeError, TodoActions.toggleError),
        tap(action => console.log(action.message))
      ),
    { dispatch: false }
  );
}
