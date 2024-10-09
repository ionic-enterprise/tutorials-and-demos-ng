import ionicPrettierConfig from '@ionic/prettier-config';

const overrides = [
  ...ionicPrettierConfig.overrides,
  {
    files: '*.html',
    options: {
      parser: 'angular',
    },
  },
];

export default {
  ...ionicPrettierConfig,
  overrides,
};
