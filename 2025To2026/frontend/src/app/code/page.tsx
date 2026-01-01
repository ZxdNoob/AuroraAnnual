import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code, FileText, Plus, Save } from 'lucide-react'

/**
 * 在线编码页面组件
 * 
 * @description 在线代码编辑器页面，支持多语言编程
 */
export default function CodePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">在线编码</h1>
          <p className="text-muted-foreground">
            基于 Monaco Editor 的专业代码编辑器，支持多种编程语言
          </p>
        </div>

        {/* 编辑器区域 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>代码编辑器</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  支持 JavaScript、TypeScript、Python、Go、Java 等多种语言
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  新建文件
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Monaco Editor 将在这里集成 */}
            <div className="border rounded-lg bg-muted/50 h-[600px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <Code className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold">Monaco Editor 即将集成</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    专业的代码编辑器，提供语法高亮、代码补全、错误提示等功能
                  </p>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  开始编码
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 功能说明 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>支持的语言</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>JavaScript</span>
                  <span className="text-muted-foreground">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>TypeScript</span>
                  <span className="text-muted-foreground">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Python</span>
                  <span className="text-muted-foreground">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Go</span>
                  <span className="text-muted-foreground">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Java</span>
                  <span className="text-muted-foreground">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>更多语言...</span>
                  <span className="text-muted-foreground">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>编辑器功能</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>语法高亮</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>代码补全</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>错误提示</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>代码格式化</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>多文件管理</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>自动保存</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

