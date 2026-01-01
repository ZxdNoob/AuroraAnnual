import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateCodeFileDto, UpdateCodeFileDto, MoveCodeFileDto, CodeFileDto, CodeFileTreeNodeDto } from './dto/code-file.dto'
import { detectLanguage, getDefaultExtension } from './utils/language-detector'

/**
 * 代码文件服务
 * 
 * @description 处理在线编码相关的业务逻辑：
 * - 文件/文件夹创建
 * - 文件/文件夹删除
 * - 文件/文件夹重命名
 * - 文件/文件夹移动
 * - 代码保存
 * - 文件树结构获取
 */
@Injectable()
export class CodeService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建文件或文件夹
   * 
   * @param userId 用户 ID
   * @param createDto 创建文件 DTO
   * @returns 创建的文件信息
   */
  async createFile(userId: string, createDto: CreateCodeFileDto): Promise<CodeFileDto> {
    // 检查父文件夹是否存在（如果提供了 parentId）
    if (createDto.parentId) {
      const parent = await this.prisma.codeFile.findFirst({
        where: {
          id: createDto.parentId,
          userId,
          isFolder: true,
        },
      })

      if (!parent) {
        throw new NotFoundException('父文件夹不存在')
      }
    }

    // 检查路径是否已存在
    const existing = await this.prisma.codeFile.findFirst({
      where: {
        userId,
        path: createDto.path,
      },
    })

    if (existing) {
      throw new ConflictException('该路径已存在')
    }

    // 检测语言（如果不是文件夹且未提供语言）
    let language = createDto.language || 'text'
    if (!createDto.isFolder && !createDto.language) {
      language = detectLanguage(createDto.name)
    }

    // 计算文件大小
    const size = createDto.content?.length || 0

    // 创建文件
    const file = await this.prisma.codeFile.create({
      data: {
        userId,
        name: createDto.name,
        path: createDto.path,
        content: createDto.content || '',
        language,
        isFolder: createDto.isFolder || false,
        parentId: createDto.parentId,
        size,
      },
    })

    return this.mapToDto(file)
  }

  /**
   * 获取文件内容
   * 
   * @param userId 用户 ID
   * @param fileId 文件 ID
   * @returns 文件信息
   */
  async getFile(userId: string, fileId: string): Promise<CodeFileDto> {
    const file = await this.prisma.codeFile.findFirst({
      where: {
        id: fileId,
        userId,
      },
    })

    if (!file) {
      throw new NotFoundException('文件不存在')
    }

    return this.mapToDto(file)
  }

  /**
   * 更新文件
   * 
   * @param userId 用户 ID
   * @param fileId 文件 ID
   * @param updateDto 更新文件 DTO
   * @returns 更新后的文件信息
   */
  async updateFile(
    userId: string,
    fileId: string,
    updateDto: UpdateCodeFileDto
  ): Promise<CodeFileDto> {
    // 检查文件是否存在
    const file = await this.prisma.codeFile.findFirst({
      where: {
        id: fileId,
        userId,
        isFolder: false, // 只能更新文件，不能更新文件夹
      },
    })

    if (!file) {
      throw new NotFoundException('文件不存在')
    }

    // 如果更新了名称，检测语言
    let language = updateDto.language || file.language
    if (updateDto.name && !updateDto.language) {
      language = detectLanguage(updateDto.name)
    }

    // 计算新的文件大小
    const newContent = updateDto.content !== undefined ? updateDto.content : file.content
    const size = newContent.length

    // 如果更新了路径，检查新路径是否已存在
    if (updateDto.path && updateDto.path !== file.path) {
      const existing = await this.prisma.codeFile.findFirst({
        where: {
          userId,
          path: updateDto.path,
          id: { not: fileId },
        },
      })

      if (existing) {
        throw new ConflictException('该路径已存在')
      }
    }

    // 更新文件
    const updated = await this.prisma.codeFile.update({
      where: { id: fileId },
      data: {
        name: updateDto.name || file.name,
        path: updateDto.path || file.path,
        content: updateDto.content !== undefined ? updateDto.content : file.content,
        language,
        size,
      },
    })

    return this.mapToDto(updated)
  }

  /**
   * 删除文件或文件夹
   * 
   * @param userId 用户 ID
   * @param fileId 文件 ID
   */
  async deleteFile(userId: string, fileId: string): Promise<void> {
    // 检查文件是否存在
    const file = await this.prisma.codeFile.findFirst({
      where: {
        id: fileId,
        userId,
      },
    })

    if (!file) {
      throw new NotFoundException('文件不存在')
    }

    // 如果是文件夹，检查是否有子文件
    if (file.isFolder) {
      const children = await this.prisma.codeFile.findFirst({
        where: {
          parentId: fileId,
          userId,
        },
      })

      if (children) {
        throw new BadRequestException('文件夹不为空，无法删除')
      }
    }

    // 删除文件（级联删除由数据库处理）
    await this.prisma.codeFile.delete({
      where: { id: fileId },
    })
  }

  /**
   * 重命名文件或文件夹
   * 
   * @param userId 用户 ID
   * @param fileId 文件 ID
   * @param newName 新名称
   * @returns 更新后的文件信息
   */
  async renameFile(userId: string, fileId: string, newName: string): Promise<CodeFileDto> {
    const file = await this.prisma.codeFile.findFirst({
      where: {
        id: fileId,
        userId,
      },
    })

    if (!file) {
      throw new NotFoundException('文件不存在')
    }

    // 构建新路径
    const pathParts = file.path.split('/')
    pathParts[pathParts.length - 1] = newName
    const newPath = pathParts.join('/')

    // 检查新路径是否已存在
    const existing = await this.prisma.codeFile.findFirst({
      where: {
        userId,
        path: newPath,
        id: { not: fileId },
      },
    })

    if (existing) {
      throw new ConflictException('该路径已存在')
    }

    // 如果不是文件夹，检测语言
    let language = file.language
    if (!file.isFolder) {
      language = detectLanguage(newName)
    }

    // 更新文件
    const updated = await this.prisma.codeFile.update({
      where: { id: fileId },
      data: {
        name: newName,
        path: newPath,
        language,
      },
    })

    return this.mapToDto(updated)
  }

  /**
   * 移动文件或文件夹
   * 
   * @param userId 用户 ID
   * @param fileId 文件 ID
   * @param moveDto 移动文件 DTO
   * @returns 更新后的文件信息
   */
  async moveFile(userId: string, fileId: string, moveDto: MoveCodeFileDto): Promise<CodeFileDto> {
    const file = await this.prisma.codeFile.findFirst({
      where: {
        id: fileId,
        userId,
      },
    })

    if (!file) {
      throw new NotFoundException('文件不存在')
    }

    // 如果提供了 parentId，检查父文件夹是否存在
    if (moveDto.parentId) {
      const parent = await this.prisma.codeFile.findFirst({
        where: {
          id: moveDto.parentId,
          userId,
          isFolder: true,
        },
      })

      if (!parent) {
        throw new NotFoundException('目标文件夹不存在')
      }

      // 不能将文件夹移动到自己的子文件夹中
      if (file.isFolder) {
        const isDescendant = await this.isDescendant(fileId, moveDto.parentId, userId)
        if (isDescendant) {
          throw new BadRequestException('不能将文件夹移动到自己的子文件夹中')
        }
      }
    }

    // 构建新路径
    let newPath = moveDto.newPath
    if (!newPath) {
      if (moveDto.parentId) {
        const parent = await this.prisma.codeFile.findUnique({
          where: { id: moveDto.parentId },
        })
        newPath = parent ? `${parent.path}/${file.name}` : file.path
      } else {
        newPath = file.name // 移动到根目录
      }
    }

    // 检查新路径是否已存在
    const existing = await this.prisma.codeFile.findFirst({
      where: {
        userId,
        path: newPath,
        id: { not: fileId },
      },
    })

    if (existing) {
      throw new ConflictException('该路径已存在')
    }

    // 更新文件
    const updated = await this.prisma.codeFile.update({
      where: { id: fileId },
      data: {
        parentId: moveDto.parentId || null,
        path: newPath,
      },
    })

    return this.mapToDto(updated)
  }

  /**
   * 获取用户的文件树
   * 
   * @param userId 用户 ID
   * @param parentId 父文件夹 ID（可选，用于获取指定文件夹下的文件树）
   * @returns 文件树结构
   */
  async getFileTree(userId: string, parentId?: string): Promise<CodeFileTreeNodeDto[]> {
    // 获取所有文件
    const where: any = { userId }
    if (parentId) {
      where.parentId = parentId
    } else {
      where.parentId = null // 根目录
    }

    const files = await this.prisma.codeFile.findMany({
      where,
      orderBy: [
        { isFolder: 'desc' }, // 文件夹在前
        { name: 'asc' },
      ],
    })

    // 构建文件树
    const tree: CodeFileTreeNodeDto[] = []
    for (const file of files) {
      const node: CodeFileTreeNodeDto = {
        file: this.mapToDto(file),
      }

      // 如果是文件夹，递归获取子文件
      if (file.isFolder) {
        node.children = await this.getFileTree(userId, file.id)
      }

      tree.push(node)
    }

    return tree
  }

  /**
   * 检查 fileId 是否是 parentId 的后代
   * 
   * @param fileId 文件 ID
   * @param parentId 父文件 ID
   * @param userId 用户 ID
   * @returns 是否是后代
   */
  private async isDescendant(fileId: string, parentId: string, userId: string): Promise<boolean> {
    let currentId = parentId

    while (currentId) {
      const current = await this.prisma.codeFile.findFirst({
        where: {
          id: currentId,
          userId,
        },
      })

      if (!current) {
        break
      }

      if (current.parentId === fileId) {
        return true
      }

      currentId = current.parentId || undefined
    }

    return false
  }

  /**
   * 将 Prisma 模型转换为 DTO
   * 
   * @param file Prisma 模型
   * @returns DTO
   */
  private mapToDto(file: any): CodeFileDto {
    return {
      id: file.id,
      name: file.name,
      path: file.path,
      content: file.isFolder ? undefined : file.content,
      language: file.language,
      isFolder: file.isFolder,
      parentId: file.parentId || undefined,
      size: file.size,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }
  }
}

