module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "standard-with-typescript",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "tsconfigRootDir": __dirname,
    "project": "tsconfig.json",
    "sourceType": "module"
  },
  "rules": {
    "semi": [2, "always"],
    "@typescript-eslint/semi": [2, "always"],
    "no-new": [0, "always"]
  }
};
