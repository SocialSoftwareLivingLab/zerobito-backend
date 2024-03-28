import { SetMetadata } from '@nestjs/common';

export const PROTEGIDO_KEY = 'isProtegido';
export const Protegido = () => SetMetadata(PROTEGIDO_KEY, true);
