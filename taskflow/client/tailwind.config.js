/** @type {import('tailwindcss').Config} */
export default {
  // 通过 class 手动控制深色模式
  darkMode: 'class',
  // 指定 Tailwind CSS 需要扫描的文件路径，用于按需生成样式
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // 扩展默认主题配置
    extend: {
      // 自定义颜色变量
      colors: {
        primary: '#3B82F6',   // 主色调 (蓝色)
        success: '#22C55E',   // 成功状态色 (绿色)
        warning: '#F59E0B',   // 警告状态色 (黄色)
        danger: '#EF4444',    // 危险/错误状态色 (红色)
      },
    },
  },
  // 配置 Tailwind 插件，当前为空
  plugins: [],
};
