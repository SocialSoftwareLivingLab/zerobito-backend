import { SetMetadata } from '@nestjs/common';
import { PROTEGIDO_KEY } from './protegido.decorator';

export const Publico = () => SetMetadata(PROTEGIDO_KEY, false);
