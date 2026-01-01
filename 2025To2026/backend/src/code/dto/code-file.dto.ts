import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum } from 'class-validator'

/**
 * 支持的语言类型
 */
export enum SupportedLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  C = 'c',
  GO = 'go',
  RUST = 'rust',
  PHP = 'php',
  RUBY = 'ruby',
  SWIFT = 'swift',
  KOTLIN = 'kotlin',
  HTML = 'html',
  CSS = 'css',
  SCSS = 'scss',
  LESS = 'less',
  JSON = 'json',
  YAML = 'yaml',
  MARKDOWN = 'markdown',
  TEXT = 'text',
}

/**
 * 创建文件/文件夹 DTO
 */
export class CreateCodeFileDto {
  @ApiProperty({ description: '文件/文件夹名称' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '文件路径' })
  @IsString()
  @IsNotEmpty()
  path: string

  @ApiProperty({ description: '文件内容', required: false })
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty({ description: '编程语言', enum: SupportedLanguage, required: false })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage

  @ApiProperty({ description: '是否为文件夹', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isFolder?: boolean

  @ApiProperty({ description: '父文件夹 ID', required: false })
  @IsString()
  @IsOptional()
  parentId?: string
}

/**
 * 更新文件 DTO
 */
export class UpdateCodeFileDto {
  @ApiProperty({ description: '文件名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '文件路径', required: false })
  @IsString()
  @IsOptional()
  path?: string

  @ApiProperty({ description: '文件内容', required: false })
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty({ description: '编程语言', enum: SupportedLanguage, required: false })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage
}

/**
 * 移动文件 DTO
 */
export class MoveCodeFileDto {
  @ApiProperty({ description: '目标父文件夹 ID', required: false })
  @IsString()
  @IsOptional()
  parentId?: string

  @ApiProperty({ description: '新路径', required: false })
  @IsString()
  @IsOptional()
  newPath?: string
}

/**
 * 代码文件响应 DTO
 */
export class CodeFileDto {
  @ApiProperty({ description: '文件 ID' })
  id: string

  @ApiProperty({ description: '文件名称' })
  name: string

  @ApiProperty({ description: '文件路径' })
  path: string

  @ApiProperty({ description: '文件内容', required: false })
  content?: string

  @ApiProperty({ description: '编程语言' })
  language: string

  @ApiProperty({ description: '是否为文件夹' })
  isFolder: boolean

  @ApiProperty({ description: '父文件夹 ID', required: false })
  parentId?: string

  @ApiProperty({ description: '文件大小（字节）' })
  size: number

  @ApiProperty({ description: '创建时间' })
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date
}

/**
 * 文件树节点 DTO
 */
export class CodeFileTreeNodeDto {
  @ApiProperty({ description: '文件信息' })
  file: CodeFileDto

  @ApiProperty({ description: '子文件列表', type: [CodeFileTreeNodeDto], required: false })
  children?: CodeFileTreeNodeDto[]
}

