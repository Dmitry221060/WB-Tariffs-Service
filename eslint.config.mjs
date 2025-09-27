import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    ...tseslint.config(
        {
            ignores: ["node_modules", "dist"],
        },
        eslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        eslintPluginPrettierRecommended,
        {
            plugins: {
                import: importPlugin,
            },
            languageOptions: {
                globals: {
                    ...globals.node,
                    ...globals.jest,
                },
                sourceType: "module",
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: import.meta.dirname,
                },
            },
            rules: {
                "node/file-extension-in-import": "off",
                "class-methods-use-this": "off",
                "@typescript-eslint/no-unsafe-argument": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "object-shorthand": ["warn", "properties"],
                "import/no-named-as-default-member": "off",
                "import/default": "off",
                "import/order": [
                    "error",
                    {
                        groups: ["builtin", "external", "internal", "type", "parent", "sibling", "object", "index"],
                        pathGroups: [
                            {
                                pattern: "@nestjs/**",
                                group: "builtin",
                                position: "before",
                            },
                            {
                                pattern: "**/interfaces/**",
                                group: "type",
                                position: "before",
                            },
                            {
                                pattern: "#*",
                                group: "parent",
                                position: "before",
                            },
                            {
                                pattern: "./*",
                                group: "sibling",
                                position: "before",
                            },
                        ],
                        distinctGroup: true,
                        warnOnUnassignedImports: true,
                        pathGroupsExcludedImportTypes: ["@nestjs/**"],
                    },
                ],
            },
        },
    ),
    {
        files: ["**/*.spec.ts", "**/test/integration/**", "**/test/utils/**"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/require-await": "off",
        },
    },
];
