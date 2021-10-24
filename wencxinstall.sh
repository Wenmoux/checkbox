# cron: 0 0 * * *
# new Env('签到盒安装,手动运行一次后请禁用');
echo "生成配置文件"
echo "cookie填写请去config.yml填写 青龙面板也有文件编辑功能"
cp /ql/repo/Wenmoux_checkbox/config.yml.temple /ql/config/config.yml
echo "安装依赖,不知道你的npm会不会报错我就npm pnpm一起用了 不会高大上的emmmm...."
npm install  axios crypto crypto-js fs iconv-lite js-yaml yargs
pnpm install  axios crypto crypto-js fs iconv-lite js-yaml yargs