# cron: 0 0 * * *
# new Env('签到盒安装 旧青龙 &&依赖安装');
if [ ! -f "/ql/config/config.yaml" ]; then
 echo "生成配置文件 路径ql/config/config.yaml"
 cp /ql/repo/Wenmoux_checkbox_master/config.yaml.temple /ql/config/config.yaml
else
 echo "已存在配置文件"
 echo "生成空白模板 /ql/config/config.yaml.sample"
 cp /ql/repo/Wenmoux_checkbox_master/config.yaml.temple /ql/config/config.yaml.sample
fi

echo "cookie填写请去config/config.yaml填写 青龙面板也有文件编辑功能"
echo "安装依赖,不知道你的npm会不会报错我就npm pnpm一起用了 不会高大上的emmmm...."
pnpm install  axios crypto-js iconv-lite js-yaml yargs
npm install  axios crypto-js iconv-lite js-yaml yargs
echo "over 记得禁用我哦ԅ(¯ㅂ¯ԅ)"
