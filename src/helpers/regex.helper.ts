const password =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

const CNPJ = /(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/;

export const RegexHelper = {
  password,
  CNPJ,
};
