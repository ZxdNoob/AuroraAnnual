# 数据库设计

## 数据库选型

- **主数据库**：PostgreSQL 15+
- **缓存数据库**：Redis 7+
- **ORM**：Prisma 5+

## 数据库表设计

### 用户表 (users)

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  password      String    // bcrypt 加密
  nickname      String?
  avatar        String?   // 头像 URL
  role          UserRole  @default(USER)
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 关联关系
  profile       UserProfile?
  checkIns      CheckIn[]
  points        Point[]
  ranks         Rank[]
  experiences   Experience[]
  badges        UserBadge[]
  lotteries     Lottery[]
  codeFiles     CodeFile[]
  activities    ActivityParticipant[]

  @@index([email])
  @@index([username])
  @@index([role])
}
```

**字段说明**：
- `id`：用户唯一标识（UUID）
- `email`：邮箱（唯一）
- `username`：用户名（唯一）
- `password`：密码（bcrypt 加密）
- `nickname`：昵称
- `avatar`：头像 URL
- `role`：用户角色（USER、SUPER_ADMIN）
- `isActive`：是否激活
- `lastLoginAt`：最后登录时间

### 用户资料表 (user_profiles)

```prisma
model UserProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  bio           String?  // 个人简介
  location      String?  // 所在地
  website       String?  // 个人网站
  github        String?  // GitHub 账号
  totalPoints   Int      @default(0)  // 总积分
  currentRankId String?  // 当前段位 ID
  currentLevel  Int      @default(1)  // 当前等级
  currentExp    Int      @default(0)  // 当前经验值
  nextLevelExp  Int      @default(100) // 下一级所需经验值
  consecutiveLoginDays   Int @default(0)  // 连续登录天数
  consecutiveCheckInDays  Int @default(0)  // 连续打卡天数
  totalCheckInDays        Int @default(0)  // 总打卡天数
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  currentRank   Rank?    @relation(fields: [currentRankId], references: [id])

  @@index([userId])
}
```

### 打卡记录表 (check_ins)

```prisma
model CheckIn {
  id            String   @id @default(uuid())
  userId        String
  checkInDate   DateTime @default(now())
  pointsEarned   Int      // 获得的积分
  expEarned      Int      // 获得的经验值
  consecutiveDays Int    // 连续打卡天数
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, checkInDate])
  @@index([userId])
  @@index([checkInDate])
}
```

### 积分记录表 (points)

```prisma
model Point {
  id            String   @id @default(uuid())
  userId        String
  amount        Int      // 积分数量（正数为获得，负数为消费）
  type          PointType // 积分类型
  description   String?  // 描述
  relatedId     String?  // 关联 ID（如抽奖 ID、活动 ID 等）
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([createdAt])
}
```

**积分类型 (PointType)**：
- `CHECK_IN`：打卡获得
- `LOTTERY`：抽奖获得
- `ACTIVITY`：活动获得
- `CONSUME`：消费（抽奖、购买等）

### 段位表 (ranks)

```prisma
model Rank {
  id            String   @id @default(uuid())
  name          String   @unique // 段位名称（如：倔强黑铁、不屈白银等）
  level         Int      @unique // 段位等级（1-13）
  minStars      Int      @default(1) // 最小星级
  maxStars      Int      // 最大星级
  requiredCheckIns Int   // 晋升所需打卡天数
  season        Int      @default(1) // 赛季数（累加，从 1 开始）
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // 关联关系
  userRanks     UserRank[]
  userProfiles  UserProfile[]

  @@index([level])
  @@index([season])
}
```

**段位数据**：
1. 倔强黑铁（level: 1, maxStars: 2）
2. 不屈白银（level: 2, maxStars: 3）
3. 黄金（level: 3, maxStars: 5）
4. 白金（level: 4, maxStars: 5）
5. 钻石（level: 5, maxStars: 5）
6. 星耀（level: 6, maxStars: 5）
7. 不凡大师（level: 7, maxStars: 5）
8. 宗师（level: 8, maxStars: 5）
9. 最强王者（level: 9, maxStars: 5）
10. 非凡王者（level: 10, maxStars: 5）
11. 至圣王者（level: 11, maxStars: 5）
12. 荣耀王者（level: 12, maxStars: 5）
13. 传奇王者（level: 13, maxStars: 无上限，1 星到 n 星）

### 用户段位表 (user_ranks)

```prisma
model UserRank {
  id            String   @id @default(uuid())
  userId        String
  rankId        String
  stars         Int      @default(1) // 当前星级
  checkInCount  Int      @default(0) // 当前段位打卡次数
  season        Int      // 赛季数（累加，从 1 开始）
  achievedAt    DateTime @default(now()) // 达成时间
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  rank          Rank     @relation(fields: [rankId], references: [id], onDelete: Cascade)

  @@unique([userId, rankId, season])
  @@index([userId])
  @@index([rankId])
  @@index([season])
}
```

### 经验记录表 (experiences)

```prisma
model Experience {
  id            String   @id @default(uuid())
  userId        String
  amount        Int      // 经验值数量
  type          ExperienceType // 经验类型
  description   String?  // 描述
  relatedId     String?  // 关联 ID
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([createdAt])
}
```

**经验类型 (ExperienceType)**：
- `LOGIN`：登录获得
- `CHECK_IN`：打卡获得
- `CONSECUTIVE_LOGIN`：连续登录加成
- `CONSECUTIVE_CHECK_IN`：连续打卡加成
- `LEVEL_BONUS`：等级加成

### 勋章表 (badges)

```prisma
model Badge {
  id            String   @id @default(uuid())
  name          String   @unique // 勋章名称
  description   String?  // 勋章描述
  icon          String   // SVG 图标路径或 URL
  type          BadgeType // 勋章类型
  condition     Json     // 获取条件（JSON）
  rarity        BadgeRarity @default(COMMON) // 稀有度
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // 关联关系
  userBadges    UserBadge[]

  @@index([type])
  @@index([rarity])
}
```

**勋章类型 (BadgeType)**：
- `CHECK_IN`：打卡勋章
- `LOGIN`：登录勋章
- `LEVEL`：等级勋章
- `RANK`：段位勋章
- `MILESTONE`：里程碑勋章

**稀有度 (BadgeRarity)**：
- `COMMON`：普通
- `RARE`：稀有
- `EPIC`：史诗
- `LEGENDARY`：传说

### 用户勋章表 (user_badges)

```prisma
model UserBadge {
  id            String   @id @default(uuid())
  userId        String
  badgeId       String
  achievedAt    DateTime @default(now()) // 获得时间
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge         Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@index([userId])
  @@index([badgeId])
}
```

### 抽奖表 (lotteries)

```prisma
model Lottery {
  id            String   @id @default(uuid())
  userId        String
  prizeType     PrizeType // 奖品类型
  prizeId       String?  // 奖品 ID（如道具 ID）
  prizeName     String   // 奖品名称
  prizeValue    Int?     // 奖品价值（如红包金额）
  cost          Int      // 消耗的积分
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([prizeType])
  @@index([createdAt])
}
```

**奖品类型 (PrizeType)**：
- `RED_PACKET`：红包
- `ITEM`：道具
- `LIMITED_REWARD`：限定奖励

### 道具表 (items)

```prisma
model Item {
  id            String   @id @default(uuid())
  name          String   @unique // 道具名称
  description   String?  // 道具描述
  type          ItemType // 道具类型
  effect        Json     // 效果（JSON，如：{expBonus: 50, pointsBonus: 10}）
  icon          String   // 图标路径
  rarity        ItemRarity @default(COMMON) // 稀有度
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // 关联关系
  userItems     UserItem[]

  @@index([type])
  @@index([rarity])
}
```

**道具类型 (ItemType)**：
- `EXP_BOOST`：经验加成卡
- `POINTS_BOOST`：积分加成卡
- `RANK_BOOST`：段位加成卡

**稀有度 (ItemRarity)**：
- `COMMON`：普通
- `RARE`：稀有
- `EPIC`：史诗
- `LEGENDARY`：传说

### 用户道具表 (user_items)

```prisma
model UserItem {
  id            String   @id @default(uuid())
  userId        String
  itemId        String
  quantity      Int      @default(1) // 数量
  isUsed        Boolean  @default(false) // 是否已使用
  usedAt        DateTime? // 使用时间
  expiresAt     DateTime? // 过期时间
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  item          Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([itemId])
  @@index([isUsed])
}
```

### 活动表 (activities)

```prisma
model Activity {
  id            String   @id @default(uuid())
  name          String   // 活动名称
  description   String?  // 活动描述
  startTime     DateTime // 开始时间
  endTime       DateTime // 结束时间
  isActive      Boolean  @default(true) // 是否激活
  rewards       Json     // 奖励配置（JSON）
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // 关联关系
  participants  ActivityParticipant[]

  @@index([startTime])
  @@index([endTime])
  @@index([isActive])
}
```

### 活动参与表 (activity_participants)

```prisma
model ActivityParticipant {
  id            String   @id @default(uuid())
  userId        String
  activityId    String
  rewardLevel   String?  // 奖励等级（一等奖、二等奖、三等奖等）
  rewardValue   Int?     // 奖励价值
  participatedAt DateTime @default(now()) // 参与时间
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  activity      Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)

  @@unique([userId, activityId])
  @@index([userId])
  @@index([activityId])
}
```

### 代码文件表 (code_files)

```prisma
model CodeFile {
  id            String   @id @default(uuid())
  userId        String
  name          String   // 文件名
  path          String   // 文件路径
  content       String   @default("") // 文件内容
  language      String   // 语言类型（javascript、typescript、python 等）
  isFolder      Boolean  @default(false) // 是否为文件夹
  parentId      String?  // 父文件夹 ID
  size          Int      @default(0) // 文件大小（字节）
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([parentId])
  @@index([path])
}
```

## 枚举类型

```prisma
enum UserRole {
  USER
  SUPER_ADMIN
}

enum PointType {
  CHECK_IN
  LOTTERY
  ACTIVITY
  CONSUME
}

enum ExperienceType {
  LOGIN
  CHECK_IN
  CONSECUTIVE_LOGIN
  CONSECUTIVE_CHECK_IN
  LEVEL_BONUS
}

enum BadgeType {
  CHECK_IN
  LOGIN
  LEVEL
  RANK
  MILESTONE
}

enum BadgeRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

enum PrizeType {
  RED_PACKET
  ITEM
  LIMITED_REWARD
}

enum ItemType {
  EXP_BOOST
  POINTS_BOOST
  RANK_BOOST
}

enum ItemRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}
```

## 索引设计

### 主要索引

1. **用户表索引**：
   - `email`：唯一索引，用于登录查询
   - `username`：唯一索引，用于用户名查询
   - `role`：普通索引，用于权限查询

2. **打卡记录索引**：
   - `userId + checkInDate`：唯一索引，防止重复打卡
   - `userId`：普通索引，查询用户打卡记录
   - `checkInDate`：普通索引，查询日期范围

3. **积分记录索引**：
   - `userId`：普通索引，查询用户积分记录
   - `type`：普通索引，按类型查询
   - `createdAt`：普通索引，时间范围查询

4. **段位索引**：
   - `level`：普通索引，段位等级查询
   - `season`：普通索引，赛季查询

5. **经验记录索引**：
   - `userId`：普通索引，查询用户经验记录
   - `type`：普通索引，按类型查询
   - `createdAt`：普通索引，时间范围查询

## 数据库关系图

```
User (1) ──< (N) UserProfile
User (1) ──< (N) CheckIn
User (1) ──< (N) Point
User (1) ──< (N) UserRank ──> (N) Rank
User (1) ──< (N) Experience
User (1) ──< (N) UserBadge ──> (N) Badge
User (1) ──< (N) Lottery
User (1) ──< (N) UserItem ──> (N) Item
User (1) ──< (N) ActivityParticipant ──> (N) Activity
User (1) ──< (N) CodeFile
```

## 数据迁移策略

1. **初始迁移**：创建所有表结构
2. **数据迁移**：使用 Prisma Migrate
3. **版本控制**：迁移文件纳入版本控制
4. **回滚策略**：支持迁移回滚

## 性能优化

1. **索引优化**：关键字段建立索引
2. **查询优化**：避免 N+1 查询，使用 Prisma 的 `include`
3. **分页查询**：大数据量使用分页
4. **缓存策略**：热点数据使用 Redis 缓存

## 数据安全

1. **密码加密**：使用 bcrypt（成本因子 10）
2. **敏感数据**：不在日志中记录敏感信息
3. **SQL 注入防护**：使用 Prisma ORM，自动防护
4. **数据备份**：定期备份数据库

