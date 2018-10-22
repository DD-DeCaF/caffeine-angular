import * as projectActions from './projects.actions';
import { Project } from '../types';

export interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

export function projectsReducer(state = initialState, action: projectActions.ProjectActions) {
  switch (action.type) {
    case projectActions.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      }
  }
  return state;
}
