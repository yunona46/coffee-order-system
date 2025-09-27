module.exports = {
  eslint: {
    enable: false
  },
  webpack: {
    configure: (webpackConfig) => {
      // Вимкнути ESLint loader
      webpackConfig.module.rules = webpackConfig.module.rules.filter(rule => {
        if (rule.use && rule.use.some(use => use.loader && use.loader.includes('eslint-loader'))) {
          return false;
        }
        return true;
      });
      return webpackConfig;
    }
  }
};