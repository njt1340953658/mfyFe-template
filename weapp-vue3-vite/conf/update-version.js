const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取当前git分支名
function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    console.error('获取git分支失败:', error.message);
    process.exit(1);
  }
}

// 从分支名中提取版本号（数字和点的组合）
function extractVersionFromBranch(branchName) {
  // 匹配版本号格式：数字开头，可能跟着多个 .数字 的组合
  const versionMatch = branchName.match(/\d+(?:\.\d+)*/);
  
  if (versionMatch) {
    return versionMatch[0];
  } else {
    console.warn(`⚠️ 分支名 "${branchName}" 中未找到有效版本号格式，将使用整个分支名`);
    return branchName;
  }
}

// 更新package.json的version字段
function updatePackageVersion() {
  const packagePath = path.join(__dirname, '../package.json');
  const currentBranch = getCurrentBranch();
  
  try {
    // 读取package.json
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    // 记录原始版本
    const originalVersion = packageJson.version;
    
    // 从分支名中提取版本号
    const extractedVersion = extractVersionFromBranch(currentBranch);
    
    // 更新version为提取的版本号
    packageJson.version = extractedVersion;
    
    // 写回package.json
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`✅ 版本号已更新: ${originalVersion} → ${extractedVersion}`);

    if (originalVersion === extractedVersion) return
    
    // 将更新后的package.json添加到git暂存区
    execSync('git add package.json');
    console.log('📦 package.json已添加到暂存区');
    
  } catch (error) {
    console.error('更新package.json失败:', error.message);
    process.exit(1);
  }
}

updatePackageVersion();