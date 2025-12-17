
import { Product, NavItem, ShowcaseItem } from './types';

// =================================================================
// ⚙️ 工坊状态设置 (Site Status)
// =================================================================
export const SITE_STATUS = {
  isBusy: false, // true = 爆肝中(暂停加急/涨价), false = 营业中(可加急)
  
  // 手动控制工坊作息状态的开关
  // 'auto'     : 自动根据时间检测 (默认)
  // 'working'  : 强制设为 "营业中"
  // 'sleeping' : 强制设为 "休眠模式"
  // 'weekend'  : 强制设为 "周末慢活"
  forceStatus: 'auto' as 'auto' | 'working' | 'sleeping' | 'weekend',
};

export const SITE_INFO = {
  title: "小狼的手作工坊",
  subtitle: "/ StarrySand",
  logoText: "小狼的手作工坊",
};

export const CONTACT_INFO = {
  wechatId: "xiaolangSLE",
  officialAccountLink: "#", // 公众号链接
  platformLink: 'https://weidian.com/item.html?itemID=YOUR_ITEM_ID_HERE' // 微店等平台链接
};

// =================================================================
// 💰 优惠与折扣 (Discounts)
// =================================================================
export const DISCOUNT_CODES = [
  { code: 'WOLF', type: 'fixed', value: 5, exclusive: false, label: '萌新见面礼', tag: 'NEW' },
  { code: 'ECHO20', type: 'fixed', value: 20, exclusive: true, label: '星辰回响·返图礼', tag: 'VIP' },
  { code: 'RICH', type: 'threshold', value: 50, threshold: 200, exclusive: false, label: '满200减50', tag: 'EVENT' }
];

// =================================================================
// 🛡️ 法律与免责 (Disclaimers)
// =================================================================
export const DISCLAIMER_CONTENT = {
  copyright: {
    title: "版权·免责护盾",
    summary: "仅收工费，不背版权锅",
    content: [
      { title: "来图责任", text: "如果您提供图片进行定制，请确保您拥有该图片的合法使用权或符合合理使用范围。" },
      { title: "仅收工费", text: "工坊收取的费用仅包含材料成本与手作工艺费，不包含任何IP授权或许可费用。" },
      { title: "侵权避雷", text: "若因您提供的素材产生任何版权、商用等法律纠纷，需由定制方（您）全权承担解决。", highlight: true },
      { title: "免责声明", text: "小狼只负责施展手作魔法，不背版权的锅哦！请勿将侵权风险带入工坊。🚫" }
    ]
  },
  imperfection: {
    title: "关于“不完美”声明",
    summary: "手作痕迹，婉拒验伤",
    intro: "手工制品有温度，也有它的“小脾气”",
    content: [
      { title: "手作痕迹", text: "默认初伤，婉拒对光验伤，完美主义者慎拍，赠品、物料均不售后。它不是冰冷的工业复制品。微小的气泡、打磨边缘、偶尔闯入的小灰尘，都是手作过程的一部分。", highlight: true },
      { title: "屏幕色差", text: "在屏幕上看到的颜色，和实物在不同光线下看到的颜色，可能会有细微差别。小狼会尽力还原，但无法保证 100%无色差 。请以实物为准！" },
      { title: "合理微调", text: "提供的图片，小狼会用相纸打印并手工雕刻。对于一些过于复杂的细节（例如密集的发丝、蕾丝花边），为了最终效果和牢固度，小狼可能会进行合理的简化处理。下单即代表信任我的专业判断~" }
    ]
  },
  risks: {
    title: "⚠️ 风险提示",
    summary: "气泡/流沙量/胶泡说明",
    content: [
      { text: "因气压温度等影响，高原等地区流沙类制品易产生大气泡，不在售后范围，介意请勿购买，请勿赌。", highlight: true },
      { text: "单个放置的流沙量不可控（随缘），不算瑕疵不售后，如需自定义流沙量请标明什么闪粉需要几勺。边缘可能会有些许闪粉卡住属于正常现象。" },
      { text: "边缘偶见小气泡【胶泡】工艺贴合所致无法完全避免，不售后。" },
      { text: "关于“二次创作”：图片需要手工雕刻，这属于手作过程中的二次创作。图片尺寸也会进行合理裁剪。为了最终效果，请允许我做“亿点点”简化。" }
    ]
  },
  unboxing: {
    title: "售后·开箱铁律",
    summary: "无视频不售后 / 破损重制承诺",
    intro: "魔法物品的运输总是充满了未知的风险。为了守护你的权益，当你收到来自工坊的包裹时，请务必、务必、务必执行以下“解封仪式”：",
    steps: [
      "拿起手机，开启录像模式。",
      "从未拆封的状态开始，拍摄一段不中断、不加速、一镜到底的完整开箱视频。",
      "确保视频中能清晰看到快递单号和包裹的六个面。"
    ],
    promiseTitle: "🛡️ 小狼的“绝对防御”承诺：",
    promiseText: "如果在你的开箱视频中，清晰记录到了流麻漏油或严重破损的情况，请直接把视频丢给我！\n小狼承诺：免费、无条件为您【加急重制】并补发一块全新的！\n(无需排队，你的魔法值得被温柔对待！)"
  },
  slideText: "滑动以签署契约 (Sign Contract)",
  slideSuccessText: "契约已缔结 (Contract Sealed)"
};

// =================================================================
// 📱 召唤工坊主 (Consultation / Business Card)
// =================================================================
export const CONSULTATION_CONTENT = {
  title: "✨ 召唤工坊主",
  desc: "(与其说是客服，不如说是陪你一起脑洞大开的 NPC。)",
  copyTemplate: "[特殊委托] 客户申请深度定制/推荐服务，请接入人工咨询。", // 保留用于兼容逻辑
  card: {
    name: "小狼SLE",
    tags: ["StarrySand 主理人", "熬夜冠军", "并不社恐(大概)"],
    caption: "扫描水晶，入侵信号频段",
    id: "WeChat: xiaolangSLE",
    qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=xiaolangSLE&bgcolor=fff&color=e11d48", 
    avatar: "https://i.pravatar.cc/150?u=wolf_avatar"
  },
  tip: "* 添加时若能备注“流麻”二字，通关速度 +100% 哦！"
};

export const LOADING_IMAGES = [
  "https://i.postimg.cc/ZqCYbPjL/IMG_20251208_205434.jpg",
  "https://i.postimg.cc/CKzMhCJN/IMG-20251208-205410.jpg",
  "https://i.postimg.cc/YSh2rN8T/IMG_20251208_205540.jpg",
  "https://i.postimg.cc/QMHN8g0L/IMG_20251208_205615.jpg",
];

// =================================================================
// 🧭 导航栏配置 (Navigation)
// =================================================================
export const NAV_CONTENT: NavItem[] = [
  { label: '作品档案', href: '#gallery' },
  { label: '定制契约', href: '#process' },
  { label: '星辰回响', href: '#star-echo' },
  { label: '私域福利', href: CONTACT_INFO.officialAccountLink },
  { label: '召唤工坊主', href: '#', isButton: true, action: 'consult' },
];

// =================================================================
// 🟢 首页 HERO 区域 (Hero Section)
// =================================================================
export const HERO_CONTENT = {
  welcomeTag: "Little Wolf's Studio",
  title: "小狼的手作工坊",
  subtitle: "/ StarrySand",
  slogan: "把你的故事，封存在这片流动的星光里",
  story: "欢迎来到我的造物台。\n我话不多，把想说的都藏进画里。\n直到第一次把画封进流沙麻将里，看着光和色在指尖里流动，那种小小的灿烂让我确定——\n即使不善言辞，我也能用自己的方式，把美好留给世界。\n\n如果你愿意，我会把你的故事、你的心意、你的期待…\n都封存在这片流动的星光里。",
  buttons: [
    { label: "👉 开始定制", href: "#process", style: "primary", main: true },
    { label: "查看作品", href: "#gallery", style: "light" },
    { label: "联系工坊主", href: "#", action: "consult", style: "light" }
  ],
  heroImage: "https://picsum.photos/800/600?random=1",
  showcaseCard: {
    title: "工坊最新",
    subtitle: "New Arrival",
    icon: "sparkles"
  }
};

// =================================================================
// 🎨 定制流程 (Process Section)
// =================================================================

// "任性玩" 模式的具体材料库
export const SELF_WILL_MATERIALS = {
  base: [
    { id: 'b01', name: '01 银色细闪', img: 'https://picsum.photos/seed/b01/100/100' },
    { id: 'b02', name: '02 香槟金粉', img: 'https://picsum.photos/seed/b02/100/100' },
    { id: 'b03', name: '03 玫瑰金粉', img: 'https://picsum.photos/seed/b03/100/100' },
    { id: 'b04', name: '04 纯白磨砂', img: 'https://picsum.photos/seed/b04/100/100' },
  ],
  pearl: [
    { id: 'p01', name: '05 幻彩人鱼珠光', img: 'https://picsum.photos/seed/p01/100/100' },
    { id: 'p02', name: '06 极光蓝紫珠光', img: 'https://picsum.photos/seed/p02/100/100' },
    { id: 'p03', name: '07 丝绸白珠光', img: 'https://picsum.photos/seed/p03/100/100' },
  ],
  glitter: [
    { id: 'g01', name: '08 镭射六边形', img: 'https://picsum.photos/seed/g01/100/100' },
    { id: 'g02', name: '09 满天星碎片', img: 'https://picsum.photos/seed/g02/100/100' },
    { id: 'g03', name: '10 银河亮片', img: 'https://picsum.photos/seed/g03/100/100' },
  ],
  special: [
    { id: 's01', name: '11 蝴蝶亮片', img: 'https://picsum.photos/seed/s01/100/100' },
    { id: 's02', name: '12 樱花切片', img: 'https://picsum.photos/seed/s02/100/100' },
    { id: 's03', name: '13 雪花切片', img: 'https://picsum.photos/seed/s03/100/100' },
  ]
};

export const PROCESS_CONTENT = {
  badge: "全场包邮 · 惊喜掉落",
  sectionTitle: "定制契约",
  sectionSubtitle: "/ Contract",
  intro: "一张张翻开你的专属契约，每一步都是一次缔结。",
  
  sizes: [
    { name: '手机伴侣款', size: '7.5×13cm', price: '63r', priceNum: 63, isSmallSize: false, desc: '修长比例，适合竖构图', image: 'https://picsum.photos/seed/size63/400/300', isRecommended: true },
    { name: '记忆珍藏版', size: '10×15cm', price: '73r', priceNum: 73, isSmallSize: false, desc: '标准相框大小，细节最丰富', image: 'https://picsum.photos/seed/size73/400/300' },
    { name: '艺术典藏级', size: '11×20cm', price: '83r', priceNum: 83, isSmallSize: false, desc: '巨幅画布，震撼视觉', image: 'https://picsum.photos/seed/size83/400/300' },
    { name: '萌趣挂件系', size: '< 8cm', price: '35r', priceNum: 35, isSmallSize: true, desc: '任意形状，随身携带', triggerWish: true, image: 'https://picsum.photos/seed/size35/400/300' },
    { name: '随身卡包级', size: '8.5×5.5cm', price: '48r', priceNum: 48, isSmallSize: true, desc: '小巧玲珑，刚好放入卡包', triggerWish: true, image: 'https://picsum.photos/seed/size48/400/300' },
  ],
  sizeNote: "* 最终价格会根据装饰的复杂程度有小幅浮动。小尺寸(随身/萌趣)享受装饰半价优惠。",

  // Path Selection Cards
  paths: {
    title: "选择你的定制模式",
    a: {
      id: 'package',
      icon: '✨',
      title: '主厨推荐模式',
      subtitle: '灵感漫游者',
      desc: '信任小狼的审美，选择一种“装饰密度”，剩下的交给我来魔法填充。',
      badges: ['省心', '高完成度']
    },
    b: {
      id: 'custom',
      icon: '🛠️',
      title: '自助餐模式',
      subtitle: '结构工程师',
      desc: '我有明确的想法！像搭积木一样，逐项挑选我想要的工艺和配件。',
      badges: ['自由', '精准控制']
    }
  },

  // PATH A: Decoration Packages (套餐)
  packages: [
    { 
      id: 'light', 
      name: '轻装饰 · 点缀感', 
      price: 15, 
      desc: '画面简洁，有呼吸感，适合日常佩戴。已包含基础装饰与流沙效果。',
      features: ['基础流沙', '少量平面拼贴', '简约排版']
    },
    { 
      id: 'standard', 
      name: '标准装饰 · 画面完整', 
      price: 25, 
      desc: '【店主推荐】装饰密度适中，整体完成度高，会根据设计灵活使用装饰元素。',
      features: ['丰富流沙', '立体/平面混合', '完整构图设计']
    },
    { 
      id: 'heavy', 
      name: '高密装饰 · 视觉饱满', 
      price: 45, 
      desc: '装饰元素丰富，层次明显，适合偏华丽风格或想要“极繁主义”效果。',
      features: ['复杂流沙工艺', '大量立体堆叠', '华丽边框/链条', '多层景深']
    }
  ],

  // PATH B: Custom Categories (自选)
  customCategories: {
    structure: {
      title: "结构型选择 (需确认)",
      desc: "物理层面的改变，一旦封胶无法修改。",
      items: [
        { name: "翻盖款", price: "+15r", priceNum: 15, desc: "像开门一样富有仪式感。外盖装饰，内层净版。", image: "https://picsum.photos/seed/door/300/200" },
        { name: "双层流麻", price: "基础价x2", priceNum: 0, multiplier: 2, desc: "空间折叠术。包含多层图+多层流沙，层次感极其丰富。", image: "https://picsum.photos/seed/double/300/200" },
        { name: "双色分仓", price: "+20r", priceNum: 20, desc: "将流麻分为两个仓室，左红右蓝，任你想象。", image: "https://picsum.photos/seed/split/300/200" },
        { name: "异形切割", price: "+30r", priceNum: 30, desc: "打破矩形限制，根据星轨走向进行了不规则的异形切割。", image: "https://picsum.photos/seed/cut/300/200" },
      ]
    },
    enhancement: {
      title: "表现型增强 (可微调)",
      desc: "视觉特效的叠加，让画面更具张力。",
      items: [
        { name: "反光工艺", price: "+10r", priceNum: 10, desc: "开闪光灯炸街必备，不开灯偏灰。", image: "https://picsum.photos/seed/reflec/300/200" },
        { name: "夜光效果", price: "+6r", priceNum: 6, desc: "关灯即亮，无声但惊艳。", image: "https://picsum.photos/seed/glow/400/200" },
        { name: "光变效果", price: "+3r", priceNum: 3, desc: "晒太阳变色。白变蓝紫/橙红。", image: "https://picsum.photos/seed/sunchange/400/200" },
        { name: "表面镭射膜", price: "+2r", priceNum: 2, desc: "给流麻表面加一层神奇滤镜。", image: "https://picsum.photos/seed/film/300/200" }
      ]
    },
    external: {
      title: "外部装饰 (最安全)",
      desc: "最后一步的点缀，完全不影响内部结构。",
      items: [
        { name: "立体拼贴", price: "+12r", priceNum: 12, desc: "PVC材质，外层真实触感。", image: "https://picsum.photos/seed/3d/200/200" },
        { name: "巴洛克堆叠", price: "+5r", priceNum: 5, desc: "贝壳/宝石等华丽风格。", image: "https://picsum.photos/seed/baro/200/200" },
        { name: "立体齿轮", price: "+5r", priceNum: 5, desc: "机械/蒸汽朋克风专属。", image: "https://picsum.photos/seed/gear/200/200" },
        { name: "碎钻镶嵌", price: "+5r", priceNum: 5, desc: "边缘镶嵌，精致闪亮。", image: "https://picsum.photos/seed/diamond/100/100" },
        { name: "普通链条", price: "+2r", priceNum: 2, desc: "金/银色基础链条。", image: "https://picsum.photos/seed/chain/100/100" },
      ]
    }
  }
};

// =================================================================
// ✨ 小尺寸福利弹窗 (Wish Modal)
// =================================================================
export const WISH_MODAL_CONTENT = {
  title: "检测到小狼的馈赠！",
  intro: "恭喜！你选择了“随身卡包级/萌趣挂件”，已触发免费的 星辰点缀 福利！",
  options: [
    {
      id: "free_light",
      title: "🎁 轻装饰套餐 (Free)",
      desc: "完全免费！包含基础流沙与简约排版，立省 15r。"
    },
    {
      id: "diy_half",
      title: "✨ 自主调配模式 (半价特权)",
      desc: "我有想要的特定装饰/风格，想亲手参与搭配。"
    }
  ],
  diyNotice: "检测到更有主见的灵魂！小尺寸专属福利已激活：所有自选装饰自动半价！",
  packagePrefForm: {
    title: "魔法定向许愿单",
    intro: "虽然是套餐，但小狼也想知道你的偏好。",
    style: {
      label: "心之所属 (风格)",
      tags: ["#梦幻粉紫", "#暗黑哥特", "#清透夏日", "#复古油画", "#赛博朋克"],
      placeholder: "或输入自定义风格..."
    },
    taboo: {
      label: "绝对禁区 (避雷)",
      placeholder: "例如：密集恐惧、蝴蝶、金色配件等",
      required: true
    },
    button: "确认并存入契约"
  }
};

// =================================================================
// 📜 契约的履行 (Fulfillment Section)
// =================================================================
export const FULFILLMENT_CONTENT = {
  sectionTitle: "契约的履行",
  sectionSubtitle: "—— 关于时间和旅程",
  
  production: {
    title: "⏳ 工期与取消",
    cycle: "定制作品的制作时间通常是 7-14个工作日。 魔法是急不来的，催单会让小狼变得慌张，可能会导致魔法失败哦！(つД)ノ",
    cancellation: "⚠️ 因为定制的唯一性，一旦开始制作，就无法退换了。如果中途确实需要取消订单，需要至少扣除总价的 20% 作为材料损耗费（越临近交差日期损耗费越高噢）。"
  },

  rush: {
    title: "🚀 加急通道特别说明",
    subtitle: "—— 当心意迫不及待想要送达",
    intro: "(｡•̀ᴗ-)✧ 小狼知道，有些心意是迫不及待想要送达的。为了应对这种紧急的“魔法召唤”，工坊特别开设了“时间加速通道”。",
    warning: "💡 注意：催动时间魔法需要消耗工坊主大量的精力值（和咖啡因 ☕），并且会打乱现有的制作序列，所以需要支付额外的“魔力涌动费用”哦！",
    tiers: [
      { id: "rush-speed", name: "超光速档", fee: "+50%", multiplier: 0.5, time: "1-2天内", desc: "纪念日前最后一刻的极限拯救！", icon: "⚡", color: "purple" },
      { id: "rush-priority", name: "优先处理档", fee: "+30%", multiplier: 0.3, time: "3-4天内", desc: "哎呀，下周就要送礼了！", icon: "🏎️", color: "red" },
      { id: "rush-stable", name: "稳定提速档", fee: "+10%", multiplier: 0.1, time: "7天内", desc: "不想等太久，稍微快一点就好。", icon: "🏃", color: "blue" }
    ],
    status: {
      idle: "🍵 悠闲模式 (订单较少)：上述加急费用将作为基准价执行。",
      busy: "🔥 爆肝模式 (订单排满)：小狼可能会上调加急费用（如超光速档调至60%或更高）。因为此时插队意味着要通宵赶工，魔力消耗成倍增加！",
      cta: "在决定是否要走加急通道前，请先带着你的需求私聊小狼进行“排期问询”"
    }
  },

  shipping: {
    confirm: {
      title: "1. 成品确认",
      desc: "完工后，小狼会为你拍摄“毕业照”（实拍图+小视频），请在 24小时内 确认。（如果超时没有回复，就默认你对作品满意啦！）"
    },
    send: {
      title: "2. 发货日",
      desc: "工坊固定的发货日是：📅 每周二、四、六。确认完毕后，你的宝贝就会在最近的一个发货日踏上旅程！"
    }
  },

  packaging: [
    { title: "【标准防护单元】", engName: "Standard Shield", tag: "Default / Free", desc: "安全第一！瓦楞纸飞机盒 + 加厚气泡缓冲层 + 硫酸纸防尘封印。确保流麻完好无损地穿越现实世界的颠簸。", image: "https://picsum.photos/400/300?grayscale&blur=2", isUpgrade: false, price: "0r", priceNum: 0, rawPrice: 0 },
    { title: "【星尘礼遇单元】", engName: "Stardust Gift Set", tag: "Upgrade (+15r)", desc: "送给TA（或自己）的惊喜。升级为硬质天地盖礼盒，内衬深空拉菲草，附赠【工坊收藏证书】及【专用养护布】。", image: "https://picsum.photos/400/300?random=gift", isUpgrade: true, price: "+15r", priceNum: 15, rawPrice: 15 }
  ]
};


// =================================================================
// 🎁 专属福利 (Benefits Section)
// =================================================================
export const BENEFITS_CONTENT = {
  sectionTitle: "专属福利",
  sectionSubtitle: "/ Benefits",
  intro: "为了感谢每一份信任与喜爱，小狼准备了一些小小的心意。希望这些福利能为你的定制之旅增添一份快乐。",
  badge: "全场包邮 · 惊喜掉落",
  
  global: [
    { title: "“首次委托”优惠", discount: "9折", subDiscount: "/ 10% OFF", desc: "第一次下单，享9折体验优惠！", iconType: "gift", badge: "New" },
    { title: "“熟客回馈”计划", discount: "8.5折", subDiscount: "/ VIP", desc: "第二笔订单起，自动升级VIP。", iconType: "heart", badge: null },
    { title: "“灵感碰撞”折扣", discount: "Max 7折", subDiscount: "/ Surprise", desc: "设计方案独特，掉落随机折扣！", iconType: "zap", badge: null }
  ]
};

// =================================================================
// 🖼️ 作品展示 (Gallery Section)
// =================================================================
export const GALLERY_CATEGORIES = [
  { id: 'all', label: '全部档案' },
  { id: 'luxury', label: '极致华丽' },
  { id: 'atmosphere', label: '意境氛围' },
  { id: 'minimalist', label: '极简设计' },
  { id: 'special', label: '特殊工艺' },
  { id: 'future', label: '未完待续' },
];

export const GALLERY_PRODUCTS: Product[] = [
  { 
    id: '001', 
    archiveId: 'N°001', 
    category: 'luxury', 
    codeName: '苍蓝视界·无下限', 
    title: '角色印象·极致华丽款', 
    description: '采用多层蓝紫色系叠加，还原“赫”与“苍”碰撞的瞬间。', 
    fullDescription: '这是为“诞生祭”特别定制的礼物。灵感来源于最强咒术师的无下限术式。\n\n我们在流沙层中使用了极其稀有的进口变色龙粉，在不同角度下呈现出从苍蓝到紫红的渐变，模拟咒力流动的轨迹。背景采用了复杂的教堂窗花镭射工艺，象征着神性与人性的交织。', 
    imageUrl: 'https://picsum.photos/600/800?random=1', 
    galleryImages: ['https://picsum.photos/600/600?random=101', 'https://picsum.photos/600/600?random=102'], 
    tags: ['高难定制', '角色印象', '华丽风'], 
    craftParams: { size: '10x15cm (记忆珍藏版)', time: '14天', techniques: ['多层悬浮滴胶', '进口变色龙粉', '镭射雕刻', '手工打磨'] }, 
    isNew: true,
    presetConfig: {
      sizeName: '记忆珍藏版',
      fluidDesc: '复刻 N°001 苍蓝视界配色',
      decorationMode: 'custom',
      addonNames: ['双层流麻', '反光工艺', '巴洛克堆叠'],
      estimatedPrice: 88
    }
  },
  { "id": "002", "archiveId": "N°002", "category": "atmosphere", "codeName": "森之语·鹿遇星光", "title": "角色印象·绮梦幻想", "description": "灵感源于森之少女与星辰的邂逅，将鹿灵的纯真与夜光的梦幻凝于一方天地。", "fullDescription": "核心创作理念源自那位自森林深处走来的鹿灵少女。为还原其空灵与自然的双重气质，本作采用了精巧的双层流麻结构，构筑出景深分明的视觉空间。\n\n主体视觉由浅粉色的基底与内嵌的白色夜光材质构成，在日间呈现温婉的少女感，于暗处则散发出林间萤火般的微光。前景悬浮着剔透的花瓣亮片，随着晃动缓缓飘落，动态模拟了角色登场时落英繽紛的场景。外层更辅以多层次的立体拼贴工艺，巴洛克风格的树脂花与金色锆石链条交错，象征着自然野性与文明饰品的碰撞融合，为整体的梦幻感增添一丝华丽注脚。", "imageUrl": "https://i.postimg.cc/V656bkdr/001.png", "galleryImages": [ "https://i.postimg.cc/bYRPj2Lr/ezgif-1e8507e0015c5ff7.gif", "https://s41.ax1x.com/2025/12/10/pZusdoj.png" ], "tags": ["IP联名", "绮丽幻想", "立体工艺"], "craftParams": { "size": "7.5x13cm", "time": "约12天", "techniques": ["双层景深流麻", "夜光材质注入", "多层立体拼贴", "巴洛克风格雕花", "锆石金链镶嵌"] },
    presetConfig: {
      sizeName: '手机伴侣款',
      fluidDesc: '复刻 N°002 森之语',
      decorationMode: 'custom',
      addonNames: ['双层流麻', '夜光效果', '立体拼贴'],
      estimatedPrice: 95
    }
  },
  { "id": "118", "archiveId": "N°118", "category": "luxury", "codeName": "虚空蝶梦·倾奇者", "title": "角色印象·绮罗典藏", "description": "以巴洛克式华丽重构散兵的孤傲与蜕变，于反光工艺中捕捉他那撕裂宿命的瞬间。", "fullDescription": "用具象化的艺术语言，去诠释他从人偶到‘倾奇者’身份的流转与挣扎。为还原其破碎又华丽的美学，本作采用了复合背景反光工艺，以此来动态模拟其周身散逸的元素能量。主体视觉由深邃的紫色调构成，立体拼贴的彩窗蝴蝶象征着挣脱束缚的灵魂，而精巧的巴洛克树脂花则暗喻其出身的高贵与被扭曲的命运。边缘环绕的紫色碎钻，不仅构建出丰富的视觉深度，更是在每一次光线流转中，折射出角色内心的矛盾与锋芒。", "imageUrl": "https://i.ibb.co/vCRrPzGD/003.png", "galleryImages": [ "https://picsum.photos/600/600?random=501", "https://picsum.photos/600/600?random=237" ], "tags": ["巴洛克幻想", "角色印象", "反光工艺"], "craftParams": { "size": "10x15cm", "time": "约15-20天","techniques": ["背景反光复合工艺", "立体彩窗蝴蝶拼贴", "巴洛克树脂花艺", "手工碎钻围边镶嵌"] } },
  { id: '004', archiveId: 'N°004', category: 'special', codeName: '星轨·夜行', title: '特殊工艺款', description: '异形切割边框，内置夜光星图，熄灯后的另一个世界。', fullDescription: '这是对技术的一次挑战。\n\n外框不再是传统的长方形，而是根据星轨走向进行了不规则的异形切割。流沙中混合了长效夜光沙，吸光30分钟后，能在黑暗中持续发光2小时。仿佛将一片星空装进了口袋。', imageUrl: 'https://picsum.photos/600/800?random=4', galleryImages: ['https://picsum.photos/600/600?random=401', 'https://picsum.photos/600/600?random=402'], tags: ['特殊工艺', '异形定制', '夜光效果'], craftParams: { size: '12x12cm (异形)', time: '20天', techniques: ['异形激光切割', '夜光沙填充', '双面观赏'] } }
];

// =================================================================
// ⚖️ 定制与修改法则 (Modification Policy)
// =================================================================
export const MODIFICATION_POLICY_CONTENT = {
  sectionTitle: "定制与修改法则",
  sectionSubtitle: "/ Modification Policy",
  stages: [
    { step: "Stage 1", title: "设计图确认", engTitle: "The Blueprint", desc: "在封胶前，小狼会提供平面布局预览。这是修改贴纸位置的唯一机会！确认后即视为定稿，进入不可逆制作流程。", warning: "一旦封胶，平面层无法移动/修改。", icon: "blueprint" },
    { step: "Stage 2", title: "流沙的随机性", engTitle: "Chaos Theory", desc: "流沙层为液体艺术，纹理随缘生成。我们会严格按照约定配色制作，但无法精确控制每一颗闪粉的落点。请享受这份独一-的随机美。", icon: "chaos" },
    { step: "Stage 3", title: "成品微调", engTitle: "Final Touches", desc: "成品产出后，仅支持对表面立体装饰（如外贴的钻、金属件）进行微调。", list: [ "1次免费微调机会。请一次性整理好修改意见哦~", "若需额外修改或大改（如拆除重做），需支付 30%~50% 的重置工费。" ], icon: "wrench" }
  ],
  emptiness: {
    title: "关于“留白”的艺术",
    desc: "为了给立体装饰留出呼吸感和层次感，平面拼贴层会适当留白。这不是偷工减料，而是为了让最终成品看起来不拥挤、更透气。请相信小狼的审美构图！"
  }
};


// =================================================================
// ✨ 社区返图 (Showcase Section)
// =================================================================
export const SHOWCASE_CONTENT = {
  sectionTitle: "星辰回响",
  sectionSubtitle: "/ Star-Echo",
  intro: "每一份返图，都是一颗被点亮的星星。感谢你们，让这个小小的工坊充满了光芒。",
  ticker: {
    prefix: "🏆 年度锦鲤池正在蓄能…",
    separator: "|",
    suffix: "下次开奖：工坊纪念日"
  },
  cta: {
    headline: "📡 信号接收中…",
    subhead: "在社媒带话题 #小狼工坊 发布返图，解锁 星尘金 与 年度锦鲤抽奖。",
    buttonText: "Copy Hashtag #小狼工坊",
    copiedText: "已复制!"
  }
};

export const SHOWCASE_DATA: ShowcaseItem[] = [
  { id: 1, img: 'https://picsum.photos/seed/showcase1/500/700', author: '@月下独酌', comment: '实物比照片还美！这个镭射效果绝了！', tag: 'STARFIRE' },
  { id: 2, img: 'https://picsum.photos/seed/showcase2/500/500', author: '@StarrySand', comment: '工坊的第一份官方样品展示。', tag: 'OFFICIAL', avatar: 'https://i.pravatar.cc/40?u=official' },
  { id: 3, img: 'https://picsum.photos/seed/showcase3/500/800', author: '@咕咕鸟', comment: '给自家OC定制的，孩子很喜欢，下次还来！', tag: 'STARFIRE', avatar: 'https://i.pravatar.cc/40?u=gugu' },
  { id: 4, img: 'https://picsum.photos/seed/showcase4/500/600', author: '@匿名希望', comment: '拍不出它的万分之一好看...流沙真的像星河！', tag: 'STARFIRE' },
  { id: 5, img: 'https://picsum.photos/seed/showcase5/500/750', author: '@StarrySand', comment: '特殊工艺「双面幻境」样品。', tag: 'OFFICIAL', avatar: 'https://i.pravatar.cc/40?u=official' },
  { id: 6, img: 'https://picsum.photos/seed/showcase6/500/550', author: '@吃不饱的狼', comment: '随手一拍都这么有氛围感，爱了爱了。', tag: 'STARFIRE', avatar: 'https://i.pravatar.cc/40?u=wolf' },
  { id: 7, img: 'https://picsum.photos/seed/showcase7/500/650', author: '@猫猫拳', comment: '阳光下太好看了！', tag: 'STARFIRE', avatar: 'https://i.pravatar.cc/40?u=cat' },
  { id: 8, img: 'https://picsum.photos/seed/showcase8/500/720', author: '@芝士就是力量', comment: '选择困难症的福音，许愿模式yyds！', tag: 'STARFIRE', avatar: 'https://i.pravatar.cc/40?u=cheese' },
];

// =================================================================
// 🛒 结算台配置 (Checkout Content)
// =================================================================
export const CHECKOUT_CONTENT = {
  header: {
    title: "✨ 定制结算台",
    subtitle: "Checkout & Estimate",
    consultationTitle: "咨询需求单",
    consultationSubtitle: "Consultation Request",
    consultationBanner: {
      title: "已进入深度定制模式",
      desc: "此模式下不显示具体金额。请复制需求单后，直接联系小狼进行一对一沟通。"
    }
  },
  labels: {
    orderDetails: "Order Details",
    noSize: "暂未选择尺寸",
    addons: "装饰与加购",
    rush: "加急服务",
    packaging: "包装方案",
    formula: "计价公式",
    baseCraft: "基础与工艺",
    addonTotal: "装饰合计",
    smallSizeDiscount: "(小尺寸半价/轻装饰免单)",
    rushFee: "加急费",
    packFee: "包装费",
    discount: "优惠折扣",
    total: "预估总价",
    saved: "已省下",
    inputPlaceholder: "输入优惠码 (如: WOLF)",
    redeem: "兑换",
    disclaimerTitle: "定制契约书",
    readSign: "需阅读并签署",
    fluidRecipe: "流沙配方"
  },
  schedule: {
    title: "工坊作息状态",
    statuses: {
      working: {
        icon: "🟢",
        label: "工坊营业中",
        text: "小狼正在工坊中工作中，当前回复稳定，消息会很快被看到"
      },
      sleeping: {
        icon: "🌙",
        label: "休眠模式",
        text: "留言已存入梦境，醒来即回。"
      },
      weekend: {
        icon: "🏖️",
        label: "周末慢活",
        text: "周末慢节奏中回复可能随机，留言都会被看到 🌱"
      }
    }
  },
  copyTemplate: {
    intro: "🦉 咚咚咚！来自 StarrySand 的信使到了！\n工坊主小狼，这是我的【定制契约】，请查收：\n",
    separator: "----------------\n",
    size: "🖼️ 尺寸：",
    craft: "🛠️ 工艺：",
    fluid: "🧪 流沙：",
    addons: "✨ 装饰/其他：\n",
    rush: "🚀 加急：",
    pack: "🎁 包装：",
    coupon: "🎟️ 优惠券：\n",
    systemTitle: "[系统计价明细]\n",
    base: "1. 基础: ",
    decor: "2. 装饰: ",
    discount: "3. 折扣: ",
    subtotal: "4. 小计: ",
    rushFee: "5. 加急费: ",
    packFee: "6.包装费: ",
    final: "\n💰 最终报价：",
    disclaimer: "(此为系统预估，最终价格以沟通为准)"
  },
  actions: {
    copy: { 
      label: "🦉 召唤工坊主 & 投递契约", 
      success: "✨ 契约已生成并复制，去微信粘贴给小狼吧！" 
    },
    platform: {
      popoverText: "需要更多保障？点击前往闲鱼/微店担保交易",
      lockedHint: "为了保障权益，请先滑动上方滑块签署契约"
    }
  }
};
