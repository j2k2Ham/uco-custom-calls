module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss'
  ],
  ignoreFiles: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**'
  ],
  rules: {
    'no-empty-source': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'variants', 'responsive', 'screen', 'theme']
      }
    ],
    'import-notation': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'rule-empty-line-before': null,
    'color-hex-length': 'short',
    'selector-class-pattern': null
  }
};
