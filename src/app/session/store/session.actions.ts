import {Action} from '@ngrx/store';

// export const SIGNUP = 'SIGNUP';
export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';

// export class Singup implements Action {
//   readonly type = SIGNUP;
// }

export class Signin implements Action {
  readonly type = SIGNIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type Sessionctions = Signin | Logout;
