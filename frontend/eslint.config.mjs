import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      import: pluginImport,
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    rules: {
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "no-console": "off",
      "no-underscore-dangle": ["error", { allow: ["__filename", "__dirname"] }],
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
      "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
      "testing-library/no-debug": "off",
      "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
      "no-trailing-spaces": "error",
      "max-len": ["error", { "code": 100 }],
      "indent": ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "import/order": ["error", { "groups": ["builtin", "external", "internal"] }],
      "quotes": ["error", "single"],
      "no-unused-vars": "off",
    }
   
  },
];
