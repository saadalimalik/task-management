import base from '@repo/eslint-config/base';

export default [
  ...base,
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration, ClassExpression',
          message: 'Use functions, not classes.',
        },
      ],
    },
  },
];
