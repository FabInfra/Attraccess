import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// TODO: add SSO to the array of strategies (e.g. keycloak)
// https://www.npmjs.com/package/@exlinc/keycloak-passport
// TODO: add OIDC support
// https://www.npmjs.com/package/@kenlo/passport-simple-oidc
export class LoginGuard extends AuthGuard(['local']) {}
