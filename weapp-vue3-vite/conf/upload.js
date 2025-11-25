const ci = require("miniprogram-ci");
const fs = require("fs");
const path = require("path");
const { version } = require('../package.json')

const mode = process.argv?.[2] || 'development';

const modeMap = {
  test: "测试环境",
  production: "生产环境",
};

const descFnc = (version) => `当前环境: ${modeMap[mode]}, 版本: ${version}, 流水线提交代码: ${new Date()}`;

// 私钥文件路径
const privateKeyPath = path.resolve(__dirname, "private.wx31c98d1a5cc52ae6.key");

// 检查私钥文件是否存在且有效
function checkPrivateKey() {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(privateKeyPath)) {
      console.log(`私钥文件不存在: ${privateKeyPath}`);
      return false;
    }

    // 读取文件内容
    const keyContent = fs.readFileSync(privateKeyPath, 'utf8');
    
    // 检查是否包含 RSA 私钥标识
    if (!keyContent.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      console.log(`私钥文件格式不正确，缺少 RSA 私钥标识`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(`检查私钥文件时出错: ${error.message}`);
    return false;
  }
}

// 项目配置
const project = new ci.Project({
  appid: "wx31c98d1a5cc52ae6",
  type: "miniProgram",
  projectPath: "dist/build/mp-weixin",
  privateKeyPath: privateKeyPath,
  ignores: ["node_modules/**/*"],
});

// 处理版本号：如果版本已包含v则不添加，否则添加v前缀
const formatVersion = (versionName) => {
  return versionName.toLowerCase().includes('v') ? versionName : `v${versionName}`;
};

// 上传配置
const uploadConfig = {
  version: formatVersion(version),
  desc: descFnc(version),
  setting: {
    es6: true,
    es7: true,
    minify: true,
    autoPrefixWXSS: true,
  },
};

// 上传函数
async function upload() {
  // 检查私钥文件
  if (!checkPrivateKey()) {
    console.log("跳过上传：私钥文件不存在或格式不正确");
    process.exit(0);
    return;
  }

  try {
    await ci.upload({
      project,
      version: uploadConfig.version,
      desc: uploadConfig.desc,
      setting: uploadConfig.setting,
    });
    console.log("上传成功");
    process.exit(0);
  } catch (error) {
    console.log(error);
    if (error.errCode === -1) {
      console.log("上传成功（但返回了 errCode -1）");
      process.exit(0);
    } else {
      console.log("上传失败");
      process.exit(1);
    }
  }
}

upload();
