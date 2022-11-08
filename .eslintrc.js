module.exports = {
  root: true,
  env: {
    node: true,
    es2016: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/restrict-plus-operands": "warn",
    "no-redeclare": "off",
    "no-unused-vars":"warn",
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-extra-parens': 'error', // 禁止不必要的括号
    'no-template-curly-in-string': 'warn', // 禁止在常规字符串中出现模板字符串语法${xxx}
    // --以下是Best Practices 最佳实践
    'default-case': 'error', // 强制switch要有default分支
    'dot-location': ['error', 'property'], // 要求对象的点要跟属性同一行
    'eqeqeq': 'warn', // 要求使用 === 和 !==
    'no-else-return': 'error', // 禁止在else前有return，return和else不能同时存在
    'no-empty-function': 'warn', // 禁止出现空函数，有意而为之的可以在函数内部加条注释
    'no-multi-spaces': 'warn', // 禁止出现多个空格，如===前后可以有一个空格，但是不能有多个空格
    'no-multi-str': 'error', // 禁止出现多行字符串，可以使用模板字符串换行
    'no-self-compare': 'error', // 禁止自身比较
    'no-unmodified-loop-condition': 'error', // 禁止一成不变的循环条件，如while条件，防止死循环
    'no-useless-concat': 'warn', // 禁止没有必要的字符串拼接，如'a'+'b'应该写成'ab'
    'require-await': 'error', // 禁止使用不带await的async表达式
    // --以下是Stylistic Issues 主观的代码风格
    // 'array-element-newline': ['error', 'consistent'], // 数组元素要一致的换行或者不换行
    'block-spacing': 'warn', // 强制函数/循环等块级作用域中的花括号内前后有一个空格（对象除外）
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }], // if/elseif/else左花括号要跟if..同行，右花括号要换行；或者全部同一行
    'comma-dangle': ['error', 'never'], // 不允许在对象或数组的最后一项加个逗号
    'comma-spacing': 'warn', // 要求在逗号后面加个空格，禁止在逗号前面加一个空格
    'comma-style': 'warn', // 要求逗号放在数组元素、对象属性或变量声明之后，且在同一行
    'computed-property-spacing': 'warn', // 禁止在计算属性中出现空格，如obj[ 'a' ]是错的，obj['a']是对的
    'eol-last': 'warn', // 强制文件的末尾有一个空行
    'func-call-spacing': 'warn', // 禁止函数名和括号之间有个空格
    'function-paren-newline': 'warn', // 强制函数括号内的参数一致换行或一致不换行
    'implicit-arrow-linebreak': 'warn', // 禁止箭头函数的隐式返回 在箭头函数体之前出现换行
    // 'indent': ['warn', 4], // 使用一致的缩进，4个空格
    // 'jsx-quotes': 'error', // 强制在jsx中使用双引号
    'key-spacing': 'warn', // 强制对象键值冒号后面有一个空格
    // 'lines-around-comment': 'error', // 要求在块级注释/**/之前有一个空行
    // 'multiline-comment-style': 'error', // 多行注释同一个风格，每一行前面都要有*
    'new-cap': 'warn', // 要求构造函数首字母大写
    // 'newline-per-chained-call': ['warn', { 'ignoreChainWithDepth': 2 }], // 链式调用长度超过2时，强制要求换行
    'no-lonely-if': 'error', // 禁止else中出现单独的if
    'no-multiple-empty-lines': 'warn', // 限制最多出现两个空行
    'no-trailing-spaces': 'warn', // 禁止在空行使用空白字符
    'no-unneeded-ternary': 'error', // 禁止多余的三元表达式，如a === 1 ? true : false应缩写为a === 1
    'no-whitespace-before-property': 'error', // 禁止属性前有空白，如console. log(obj['a'])，log前面的空白有问题
    'nonblock-statement-body-position': 'warn', // 强制单行语句不换行
    'object-curly-newline': ['warn', { 'multiline': true }], // 对象数属性要有一致的换行，都换行或都不换行
    'object-curly-spacing': ['warn', 'always'], // 强制对象/解构赋值/import等花括号前后有空格
    'object-property-newline': ['warn', { 'allowAllPropertiesOnSameLine': true }], // 强制对象的属性在同一行或全换行
    'one-var-declaration-per-line': 'warn', // 强制变量初始化语句换行
    'operator-assignment': 'warn', // 尽可能的简化赋值操作，如x=x+1 应简化为x+=1
    'quotes': ['warn', 'single'], // 要求字符串尽可能的使用单引号
    'semi': 'warn', // 要分号
    'semi-spacing': 'warn', // 强制分号后面有空格，如for (let i=0; i<20; i++)
    // 'semi-style': 'error', // 强制分号出现在句末
    'space-before-blocks': 'warn', // 强制块（for循环/if/函数等）前面有一个空格，如for(...){}是错的，花括号前面要空格：for(...) {}
    'space-infix-ops': 'warn', // 强制操作符（+-/*）前后有一个空格
    'spaced-comment': 'warn', // 强制注释（//或/*）后面要有一个空格
    // --以下是ECMAScript 6 ES6相关的
    'arrow-body-style': 'warn', // 当前头函数体的花括号可以省略时，不允许出现花括号
    'arrow-parens': ['warn', 'as-needed'], // 箭头函数参数只有一个时，不允许写圆括号
    'arrow-spacing': 'warn', // 要求箭头函数的=>前后有空格
    // 'no-confusing-arrow': 'error', // 禁止在可能与比较操作符混淆的地方使用箭头函数
    'no-duplicate-imports': 'error', // 禁止重复导入
    'no-useless-computed-key': 'error', // 禁止不必要的计算属性，如obj3={['a']: 1},其中['a']是不必要的，直接写'a'
    'no-var': 'error', // 要求使用let或const，而不是var
    'object-shorthand': 'error', // 要求对象字面量使用简写
    'prefer-const': 'error', // 要求使用const声明不会被修改的变量
    // 'prefer-destructuring': ['warn', {
    //     'array': false,
    //     'object': true
    // }, { 'enforceForRenamedProperties': true }], // 要求优先使用结构赋值,enforceForRenamedProperties为true将规则应用于重命名的变量
    // 'prefer-template': 'error', // 使用模板字符串，而不是字符串拼接
    'rest-spread-spacing': 'error', // 扩展运算符...和表达式之间不允许有空格，如... re1错误，应该是...re1
    'template-curly-spacing': 'warn', // 禁止模板字符串${}内前后有空格
  },
  plugins: ['@typescript-eslint'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
};
