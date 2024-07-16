import { SetMetadata } from '@nestjs/common';

export const NO_AUTH_KEY = 'NO_AUTH';
export const NO_AUTH = () => SetMetadata(NO_AUTH_KEY, true);
