/**
 * 生成 App 图标脚本
 * 使用 sharp 创建简单但专业的水滴图标
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 创建 SVG 水滴图标
const createWaterDropSVG = (size, backgroundColor = '#4FC3F7') => {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#81D4FA;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0288D1;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- 背景圆形 -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${backgroundColor}"/>

      <!-- 水滴形状 -->
      <path d="
        M ${size/2} ${size * 0.25}
        C ${size/2} ${size * 0.25}, ${size * 0.7} ${size * 0.5}, ${size * 0.7} ${size * 0.65}
        C ${size * 0.7} ${size * 0.75}, ${size * 0.6} ${size * 0.8}, ${size/2} ${size * 0.8}
        C ${size * 0.4} ${size * 0.8}, ${size * 0.3} ${size * 0.75}, ${size * 0.3} ${size * 0.65}
        C ${size * 0.3} ${size * 0.5}, ${size/2} ${size * 0.25}, ${size/2} ${size * 0.25}
        Z
      " fill="url(#gradient)" opacity="0.9"/>

      <!-- 高光效果 -->
      <circle cx="${size * 0.45}" cy="${size * 0.55}" r="${size * 0.08}" fill="white" opacity="0.6"/>
    </svg>
  `;
};

// 生成图标的函数
async function generateIcons() {
  const assetsDir = path.join(__dirname, '../assets/images');

  // 确保目录存在
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('🎨 开始生成 App 图标...\n');

  // 1. 生成主图标（1024x1024 - iOS 要求）
  console.log('生成主图标 (1024x1024)...');
  const mainIconSVG = createWaterDropSVG(1024);
  await sharp(Buffer.from(mainIconSVG))
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('✅ icon.png 生成成功');

  // 2. 生成启动页图标（较小，用于启动页中心）
  console.log('\n生成启动页图标 (400x400)...');
  const splashIconSVG = createWaterDropSVG(400);
  await sharp(Buffer.from(splashIconSVG))
    .png()
    .toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✅ splash-icon.png 生成成功');

  // 3. 生成 Android 自适应图标
  console.log('\n生成 Android 图标...');

  // 前景图（透明背景 + 水滴）
  const foregroundSVG = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#81D4FA;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0288D1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="
        M 512 256
        C 512 256, 716 512, 716 665
        C 716 768, 614 819, 512 819
        C 410 819, 308 768, 308 665
        C 308 512, 512 256, 512 256
        Z
      " fill="url(#gradient)" opacity="0.9"/>
      <circle cx="460" cy="563" r="82" fill="white" opacity="0.6"/>
    </svg>
  `;

  await sharp(Buffer.from(foregroundSVG))
    .png()
    .toFile(path.join(assetsDir, 'android-icon-foreground.png'));
  console.log('✅ android-icon-foreground.png 生成成功');

  // 背景图（纯色）
  const backgroundSVG = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" fill="#E6F4FE"/>
    </svg>
  `;

  await sharp(Buffer.from(backgroundSVG))
    .png()
    .toFile(path.join(assetsDir, 'android-icon-background.png'));
  console.log('✅ android-icon-background.png 生成成功');

  // 单色图（用于主题图标）
  const monochromeSVG = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <path d="
        M 512 256
        C 512 256, 716 512, 716 665
        C 716 768, 614 819, 512 819
        C 410 819, 308 768, 308 665
        C 308 512, 512 256, 512 256
        Z
      " fill="#FFFFFF"/>
    </svg>
  `;

  await sharp(Buffer.from(monochromeSVG))
    .png()
    .toFile(path.join(assetsDir, 'android-icon-monochrome.png'));
  console.log('✅ android-icon-monochrome.png 生成成功');

  // 4. 生成 favicon（网页版）
  console.log('\n生成网页 favicon...');
  const faviconSVG = createWaterDropSVG(64);
  await sharp(Buffer.from(faviconSVG))
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✅ favicon.png 生成成功');

  console.log('\n🎉 所有图标生成完成！\n');
  console.log('生成的文件：');
  console.log('  - assets/images/icon.png (1024x1024)');
  console.log('  - assets/images/splash-icon.png (400x400)');
  console.log('  - assets/images/android-icon-foreground.png');
  console.log('  - assets/images/android-icon-background.png');
  console.log('  - assets/images/android-icon-monochrome.png');
  console.log('  - assets/images/favicon.png');
}

// 运行生成
generateIcons().catch(console.error);
