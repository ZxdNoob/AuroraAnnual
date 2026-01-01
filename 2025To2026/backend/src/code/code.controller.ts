import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger'
import { CodeService } from './code.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import {
  CreateCodeFileDto,
  UpdateCodeFileDto,
  MoveCodeFileDto,
  CodeFileDto,
  CodeFileTreeNodeDto,
} from './dto/code-file.dto'

/**
 * 在线编码控制器
 * 
 * @description 提供在线编码相关的 API 接口
 */
@ApiTags('在线编码相关')
@Controller('code')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  /**
   * 创建文件或文件夹
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param createDto 创建文件 DTO
   * @returns 创建的文件信息
   */
  @Post()
  @ApiOperation({ summary: '创建文件或文件夹' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: CodeFileDto,
  })
  @ApiResponse({
    status: 409,
    description: '路径已存在',
  })
  async createFile(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateCodeFileDto
  ) {
    return this.codeService.createFile(userId, createDto)
  }

  /**
   * 获取文件内容
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param fileId 文件 ID
   * @returns 文件信息
   */
  @Get(':fileId')
  @ApiOperation({ summary: '获取文件内容' })
  @ApiParam({ name: 'fileId', description: '文件 ID' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: CodeFileDto,
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在',
  })
  async getFile(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string
  ) {
    return this.codeService.getFile(userId, fileId)
  }

  /**
   * 更新文件
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param fileId 文件 ID
   * @param updateDto 更新文件 DTO
   * @returns 更新后的文件信息
   */
  @Put(':fileId')
  @ApiOperation({ summary: '更新文件' })
  @ApiParam({ name: 'fileId', description: '文件 ID' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: CodeFileDto,
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在',
  })
  async updateFile(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string,
    @Body() updateDto: UpdateCodeFileDto
  ) {
    return this.codeService.updateFile(userId, fileId, updateDto)
  }

  /**
   * 删除文件或文件夹
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param fileId 文件 ID
   */
  @Delete(':fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除文件或文件夹' })
  @ApiParam({ name: 'fileId', description: '文件 ID' })
  @ApiResponse({
    status: 204,
    description: '删除成功',
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在',
  })
  @ApiResponse({
    status: 400,
    description: '文件夹不为空',
  })
  async deleteFile(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string
  ) {
    await this.codeService.deleteFile(userId, fileId)
  }

  /**
   * 重命名文件或文件夹
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param fileId 文件 ID
   * @param newName 新名称
   * @returns 更新后的文件信息
   */
  @Patch(':fileId/rename')
  @ApiOperation({ summary: '重命名文件或文件夹' })
  @ApiParam({ name: 'fileId', description: '文件 ID' })
  @ApiResponse({
    status: 200,
    description: '重命名成功',
    type: CodeFileDto,
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在',
  })
  async renameFile(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string,
    @Body('newName') newName: string
  ) {
    return this.codeService.renameFile(userId, fileId, newName)
  }

  /**
   * 移动文件或文件夹
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param fileId 文件 ID
   * @param moveDto 移动文件 DTO
   * @returns 更新后的文件信息
   */
  @Patch(':fileId/move')
  @ApiOperation({ summary: '移动文件或文件夹' })
  @ApiParam({ name: 'fileId', description: '文件 ID' })
  @ApiResponse({
    status: 200,
    description: '移动成功',
    type: CodeFileDto,
  })
  @ApiResponse({
    status: 404,
    description: '文件或目标文件夹不存在',
  })
  async moveFile(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string,
    @Body() moveDto: MoveCodeFileDto
  ) {
    return this.codeService.moveFile(userId, fileId, moveDto)
  }

  /**
   * 获取文件树
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param parentId 父文件夹 ID（可选）
   * @returns 文件树结构
   */
  @Get()
  @ApiOperation({ summary: '获取文件树' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [CodeFileTreeNodeDto],
  })
  async getFileTree(
    @CurrentUser('id') userId: string,
    @Query('parentId') parentId?: string
  ) {
    return this.codeService.getFileTree(userId, parentId)
  }
}

