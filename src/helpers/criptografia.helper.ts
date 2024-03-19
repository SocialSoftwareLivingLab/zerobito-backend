import { hashSync, compareSync } from 'bcrypt';

function gerarHash(texto: string): string {
  return hashSync(texto, 15);
}

function validarHash(texto: string, hash: string): boolean {
  return compareSync(texto, hash);
}

export const CriptografiaHelper = {
  gerarHash,
  validarHash,
};
