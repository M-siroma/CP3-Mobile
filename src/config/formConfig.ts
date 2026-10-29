import { FormConfig } from '../types/form';

/**
 * Configuração que define o formulário. A tela não conhece nenhum destes campos:
 * tudo o que é exibido (ordem, rótulos, tipos, opções e obrigatoriedade) vem daqui.
 * Para adicionar, remover ou reordenar campos basta editar o array `fields`.
 */
export const formConfig: FormConfig = {
  title: 'Cadastro de Usuário',
  description: 'Formulário montado dinamicamente a partir de uma configuração JSON.',
  submitLabel: 'Enviar cadastro',
  fields: [
    { id: 'name', label: 'Nome completo', type: 'text', required: true, placeholder: 'Ex.: Maria Souza' },
    { id: 'email', label: 'E-mail', type: 'email', required: true, placeholder: 'voce@exemplo.com' },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      required: true,
      minLength: 6,
      helperText: 'Mínimo de 6 caracteres.',
    },
    { id: 'age', label: 'Idade', type: 'number', required: true, placeholder: 'Ex.: 21' },
    {
      id: 'bio',
      label: 'Sobre você',
      type: 'multiline',
      required: false,
      placeholder: 'Conte um pouco sobre você (opcional)',
    },
    {
      id: 'gender',
      label: 'Gênero',
      type: 'radio',
      required: true,
      options: [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' },
        { label: 'Outro', value: 'other' },
        { label: 'Prefiro não informar', value: 'not_informed' },
      ],
    },
    {
      id: 'state',
      label: 'Estado',
      type: 'select',
      required: true,
      placeholder: 'Selecione um estado',
      options: [
        { label: 'São Paulo', value: 'SP' },
        { label: 'Rio de Janeiro', value: 'RJ' },
        { label: 'Minas Gerais', value: 'MG' },
        { label: 'Paraná', value: 'PR' },
        { label: 'Bahia', value: 'BA' },
      ],
    },
    { id: 'birthDate', label: 'Data de nascimento', type: 'date', required: true },
    {
      id: 'newsletter',
      label: 'Receber novidades por e-mail',
      type: 'switch',
      required: true,
      defaultValue: false,
      helperText: 'Ligado ou desligado são respostas válidas.',
    },
    { id: 'terms', label: 'Li e aceito os termos de uso', type: 'checkbox', required: true },
  ],
};
