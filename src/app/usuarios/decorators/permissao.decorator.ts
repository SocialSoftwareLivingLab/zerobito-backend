import { SetMetadata } from '@nestjs/common';

export const PERMISSAO_KEY = 'permissao';
export const Permissao = (...permissoes: string[]) =>
  SetMetadata(PERMISSAO_KEY, permissoes);
