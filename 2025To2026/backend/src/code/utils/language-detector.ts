/**
 * 语言检测工具
 * 
 * @description 根据文件扩展名或文件名检测编程语言
 */

/**
 * 文件扩展名到语言的映射
 */
const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  // JavaScript/TypeScript
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',

  // Python
  py: 'python',
  pyw: 'python',
  pyi: 'python',

  // Java
  java: 'java',
  class: 'java',
  jar: 'java',

  // C/C++
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cxx: 'cpp',
  cc: 'cpp',
  hpp: 'cpp',
  hxx: 'cpp',

  // Go
  go: 'go',

  // Rust
  rs: 'rust',

  // PHP
  php: 'php',
  phtml: 'php',

  // Ruby
  rb: 'ruby',
  rbw: 'ruby',

  // Swift
  swift: 'swift',

  // Kotlin
  kt: 'kotlin',
  kts: 'kotlin',

  // Web
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'scss',
  less: 'less',
  styl: 'stylus',

  // Data
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',

  // Markdown
  md: 'markdown',
  markdown: 'markdown',

  // Text
  txt: 'text',
  log: 'text',
}

/**
 * 根据文件名检测语言
 * 
 * @param fileName 文件名
 * @returns 检测到的语言，如果无法检测则返回 'text'
 */
export function detectLanguage(fileName: string): string {
  // 提取文件扩展名
  const lastDot = fileName.lastIndexOf('.')
  if (lastDot === -1 || lastDot === fileName.length - 1) {
    // 没有扩展名或扩展名为空
    return 'text'
  }

  const extension = fileName.substring(lastDot + 1).toLowerCase()
  return EXTENSION_TO_LANGUAGE[extension] || 'text'
}

/**
 * 根据语言获取默认文件扩展名
 * 
 * @param language 语言
 * @returns 默认文件扩展名
 */
export function getDefaultExtension(language: string): string {
  const languageToExtension: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    swift: 'swift',
    kotlin: 'kt',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    yaml: 'yml',
    markdown: 'md',
    text: 'txt',
  }

  return languageToExtension[language.toLowerCase()] || 'txt'
}

