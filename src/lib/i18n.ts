export const defaultLocale = 'en' as const;
export const locales = ['en', 'zh', 'ja'] as const;
export type Locale = typeof locales[number];

export const languageNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
};

// 翻译内容定义
const translations = {
  zh: {
    navigation: {
      home: '首页',
      features: '功能特性',
      howItWorks: '如何使用',
      pricing: '定价方案', 
      support: '帮助中心'
    },
    auth: {
      login: '登录',
      register: '注册',
      dashboard: '仪表板',
      logout: '退出'
    },
    login: {
      title: '登录您的账户',
      email: '邮箱地址',
      password: '密码',
      loginButton: '登录',
      loggingIn: '登录中...',
      createAccount: '创建新账户',
      backToHome: '返回首页',
      or: '或'
    },
    register: {
      title: '创建您的账户',
      nickname: '昵称',
      email: '邮箱地址',
      password: '密码',
      confirmPassword: '确认密码',
      referralCode: '推荐码（可选）',
      registerButton: '注册',
      registering: '注册中...',
      alreadyHaveAccount: '已有账户？',
      backToHome: '返回首页',
      or: '或',
      errors: {
        passwordMismatch: '密码不匹配',
        passwordTooShort: '密码至少需要6位字符',
        nicknameEmpty: '昵称不能为空',
        nicknameTooLong: '昵称长度不能超过20个字符'
      }
    },
    privacy: {
      title: '隐私政策',
      subtitle: '了解我们如何保护您的个人信息',
      lastUpdated: '最后更新',
      sections: {
        introduction: {
          title: '简介',
          content: '我们重视您的隐私。本隐私政策说明了我们如何收集、使用和保护您的个人信息。'
        },
        dataCollection: {
          title: '数据收集',
          subtitle: '我们会收集以下类型的信息：',
          directInfo: {
            title: '您直接提供的信息',
            items: [
              '账户信息（邮箱、用户名、密码）',
              '个人资料信息（姓名、头像等）',
              '您创建的任务和笔记内容',
              '与我们的客服通讯记录'
            ]
          },
          autoInfo: {
            title: '自动收集的信息',
            items: [
              '设备信息（操作系统、设备型号等）',
              '使用统计数据（功能使用频率、会话时长等）',
              '技术信息（IP地址、浏览器类型等）',
              '错误日志和性能数据'
            ]
          }
        },
        dataUsage: {
          title: '数据使用',
          items: [
            {
              title: '提供服务',
              description: '处理您的任务管理、AI建议等核心功能'
            },
            {
              title: '改进产品',
              description: '分析使用模式以优化用户体验'
            },
            {
              title: '客户支持',
              description: '响应您的问题和技术支持请求'
            },
            {
              title: '安全防护',
              description: '检测和防止欺诈、滥用等不当行为'
            }
          ]
        },
        dataSharing: {
          title: '数据共享',
          promise: '我们承诺不会出售、租用或交易您的个人信息给任何第三方。',
          exceptions: [
            '获得您明确同意的情况下',
            '遵守法律法规、法院命令或政府要求',
            '保护我们或他人的权利、财产或安全',
            '与服务提供商合作（如云服务商），但他们只能按我们的指示使用数据'
          ]
        },
        dataSecurity: {
          title: '数据安全',
          subtitle: '我们采用多层安全措施保护您的数据：',
          measures: [
            {
              title: '加密存储',
              description: '敏感数据使用行业标准加密技术'
            },
            {
              title: '访问控制',
              description: '严格限制员工对用户数据的访问权限'
            },
            {
              title: '安全审计',
              description: '定期进行安全评估和漏洞测试'
            }
          ]
        },
        userRights: {
          title: '您的权利',
          subtitle: '根据适用的隐私法律，您享有以下权利：',
          rights: [
            {
              title: '访问权',
              description: '您可以要求查看我们持有的关于您的个人信息'
            },
            {
              title: '更正权',
              description: '您可以要求我们更正不准确或不完整的信息'
            },
            {
              title: '删除权',
              description: '在某些情况下，您可以要求我们删除您的个人信息'
            },
            {
              title: '数据可携权',
              description: '您可以要求以结构化格式获取您的数据'
            }
          ]
        },
        childrenPrivacy: {
          title: '儿童隐私',
          content: '我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果我们发现收集了此类信息，将立即删除。'
        },
        policyChanges: {
          title: '政策变更',
          content: '我们可能会不时更新本隐私政策。当我们进行重大变更时，我们会通过以下方式通知您：',
          methods: [
            '在应用内发送通知',
            '向您的注册邮箱发送邮件',
            '在我们的网站上发布公告'
          ]
        },
        contact: {
          title: '联系我们',
          subtitle: '如果您对本隐私政策有任何疑问或需要行使您的权利，请联系我们：',
          email: 'privacy@dopamind.com',
          support: 'support@dopamind.com',
          responseTime: '我们承诺在收到您的询问后7个工作日内回复。'
        }
      }
    },
    support: {
      title: '帮助中心',
      subtitle: '我们随时为您提供帮助',
      contact: {
        email: {
          title: '邮件支持',
          description: '发送邮件至 support@dopamind.com',
          response: '24小时内回复'
        },
        feedback: {
          title: '产品反馈',
          description: '分享您的建议和想法'
        },
        guide: {
          title: '使用文档',
          description: '查看详细的功能说明'
        }
      },
      faq: {
        title: '常见问题',
        categories: {
          account: '账户相关'
        },
        items: [
          {
            question: '如何开始使用 Dopamind？',
            answer: '下载应用后，只需注册账户即可开始。系统会自动为您提供7天免费试用期。'
          },
          {
            question: '支持哪些平台？',
            answer: '目前支持 iOS 平台，Android 版本正在开发中。'
          },
          {
            question: '数据安全吗？',
            answer: '是的，我们使用企业级加密技术保护您的数据，所有信息都安全存储在云端。'
          },
          {
            question: '可以取消订阅吗？',
            answer: '可以随时在设置中取消订阅，取消后仍可使用到当前付费周期结束。'
          }
        ]
      },
      guides: {
        title: '功能指南',
        quickStart: {
          title: '快速开始',
          description: '5分钟了解 Dopamind 的核心功能'
        },
        aiCoach: {
          title: 'AI 教练',
          description: '如何与 AI 有效沟通获得最佳建议'
        },
        focus: {
          title: '专注模式',
          description: '番茄工作法和深度工作技巧'
        }
      },
      stillNeedHelp: {
        title: '仍需要帮助？',
        subtitle: '我们的支持团队随时为您服务，通常在24小时内回复。',
        sendEmail: '发送邮件',
        responseTime: '我们会在 24-48 小时内回复您的邮件'
      }
    },
    footer: {
      description: '专为 ADHD 用户设计的 AI 专注伙伴',
      copyright: '版权所有',
      sections: {
        product: '产品',
        support: '支持',
        legal: '法律'
      },
      links: {
        features: '功能特性',
        pricing: '定价方案',
        supportCenter: '帮助中心',
        contactUs: '联系我们',
        status: '状态页面',
        privacy: '隐私政策',
        terms: '服务条款',
        cookies: 'Cookie 政策',
        accountDeletion: '账户删除'
      }
    },
    home: {
      hero: {
        badge: '专为 ADHD 用户设计',
        title: '专为 ADHD 设计的',
        titleHighlight: 'AI 伙伴',
        subtitle: '您的思绪变为清晰的行动，用最自然的方式——对话，来管理您的整个生活。',
        downloadText: '立即下载，新用户注册享 7 天免费 Premium 试用'
      },
      features: {
        section1: {
          title: '计划，从容不迫',
          subtitle: '告别杂乱无章的待办清单。Dopamind 的智能任务系统能自动分类、排序，并通过可视化的统计激励你。让你一眼看清重点，轻松应对每一天。',
          points: [
            '智能任务分类和优先级排序',
            '进度可视化，激励持续行动',
            '告别「不知从何下手」的困扰'
          ]
        },
        section2: {
          title: '想到说到，即可办到',
          subtitle: '不再需要繁琐的手动输入。只需说出你的想法，AI 就能理解并立即为你创建任务。支持语音输入，用最自然的方式安排一切。',
          points: [
            '智能语音识别，精准理解意图',
            '自然对话式交互，无需学习成本',
            '即时任务创建，思维不被打断'
          ]
        }
      },
      howItWorks: {
        section1: {
          title: 'AI 智能拆解，告别拖延',
          subtitle: '复杂的项目？让 AI 帮你分解成小步骤。每个子任务都清晰可行，让「开始」变得简单，让「完成」变得可能。',
          example: {
            title: '示例：准备面试',
            steps: [
              '1. 准备一份整洁的简历',
              '2. 调查公司背景信息',
              '3. 准备常见面试问题答案'
            ]
          }
        },
        section2: {
          title: '沉浸式专注模式',
          subtitle: '屏蔽干扰，进入心流状态。专注计时器配合温和的提醒，帮你建立高效的工作节奏，每一分钟都有价值。',
          stats: [
            { value: '25', label: '分钟专注' },
            { value: '5', label: '分钟休息' },
            { value: '4', label: '轮循环' }
          ]
        }
      },
      globalView: {
        title: '鸟瞰你的全局计划',
        subtitle: '任务不再是孤立的点，而是在日历上清晰可见的时间线。直观地回顾过去，规划未来。AI 还能根据您一天的活动，为您生成一份专属的每日报告，提供深刻洞察。',
        badges: ['AI 日报生成', '智能提醒']
      },
      beyondTasks: {
        title: '不止任务，更是您的生活操作系统',
        subtitle: 'Dopamind 不仅帮你管理工作，更关注你的整个生活质量',
        features: [
          {
            title: '习惯养成',
            description: '用热力图见证复利的力量，建立积极的多巴胺循环。每一个小习惯都是通向更好自己的垫脚石。'
          },
          {
            title: '智能冰箱管家',
            description: '随手记录食材，智能提醒过期时间。告别「过期惊喜」，让健康饮食变得简单可控。'
          },
          {
            title: '订阅追踪',
            description: '轻松追踪所有订阅服务，告别意外扣费。掌控你的每一笔订阅，让财务管理变得透明简单。'
          }
        ]
      },
      cloudSync: {
        title: '云端同步，随时随地',
        subtitle: '您的数据安全储存在云端，在所有设备间无缝同步，让您的生活管理不受设备限制。',
        features: [
          {
            title: '实时同步',
            description: '在手机上添加的任务，立即出现在平板和电脑上。跨设备协作，让您的计划始终保持最新状态。'
          },
          {
            title: '安全备份',
            description: '企业级加密保护您的隐私数据，自动备份防止意外丢失。您的信息安全是我们的首要任务。'
          },
          {
            title: '云端同步',
            description: '在所有设备间无缝同步数据，永不丢失。无论您使用哪台设备，都能访问完整的任务和数据。'
          }
        ]
      },
      pricing: {
        title: '选择适合您的方案',
        subtitle: '解锁完整功能，开启高效生活方式',
        plans: {
          monthly: {
            title: 'Monthly',
            price: '$14.99',
            period: 'USD / month',
            features: [
              '所有高级功能',
              '无限任务和项目',
              '云端同步备份',
              'AI 智能建议'
            ]
          },
          yearly: {
            title: 'Yearly',
            price: '$159.99',
            period: 'USD / year',
            badge: 'Most Popular',
            discount: 'Save 12%',
            features: [
              '所有高级功能',
              '无限任务和项目',
              '云端同步备份',
              'AI 智能建议',
              '优先客户支持'
            ]
          }
        },
        cta: {
          monthly: '立即订阅月度方案',
          yearly: '立即订阅年度方案',
          trial: '新用户注册即享 7 天免费试用 • 随时取消'
        }
      },
      finalCta: {
        title: '准备好将混乱变为清晰了吗？',
        subtitle: '立即下载 Dopamind，让 AI 成为你最懂你的伙伴。开启专注高效的全新生活方式。',
        trial: '新用户注册即享 7 天免费试用 • 随时取消',
        users: '加入超过 10,000 名满意用户',
        termsAndPrivacy: '使用 Dopamind 即表示您同意我们的{terms}和{privacy}。',
        termsLink: '服务条款',
        privacyLink: '隐私政策',
        termsUrl: '服务条款: https://dopamind.app/terms',
        privacyUrl: '隐私政策: https://dopamind.app/privacy',
        stats: [
          { value: '10K+', label: '活跃用户' },
          { value: '95%', label: '用户满意度' },
          { value: '4.9', label: 'App Store 评分' }
        ]
      }
    },
    terms: {
      title: '服务条款',
      subtitle: '使用 Dopamind 服务前，请仔细阅读本服务条款',
      lastUpdated: '最后更新',
      sections: {
        acceptance: {
          title: '服务条款的接受',
          content: '欢迎使用 Dopamind！通过访问或使用我们的应用程序和服务，您同意受本服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。'
        },
        serviceDescription: {
          title: '服务描述',
          content: 'Dopamind 是一款专为 ADHD 用户设计的 AI 伙伴应用，提供任务管理、专注模式、习惯追踪等功能。',
          features: {
            title: '我们提供的主要功能包括：',
            items: [
              'AI 对话式任务管理',
              '智能任务分解和优先级排序',
              '专注模式和番茄工作法',
              '习惯追踪和数据可视化',
              '云端数据同步',
              '多平台支持'
            ]
          }
        },
        userResponsibilities: {
          title: '用户责任',
          subtitle: '使用我们的服务时，您需要承担以下责任：',
          items: [
            {
              title: '账户安全',
              description: '您有责任保护您的账户密码和登录信息，不得与他人共享账户。'
            },
            {
              title: '内容准确性',
              description: '您提供的所有信息应当真实、准确、完整且最新。'
            },
            {
              title: '合法使用',
              description: '您必须遵守所有适用的法律法规，不得将服务用于非法目的。'
            },
            {
              title: '尊重他人',
              description: '在与客服或其他用户互动时，应保持礼貌和尊重。'
            }
          ]
        },
        prohibitedUses: {
          title: '禁止行为',
          warning: '以下行为是被严格禁止的，违反者将面临账户暂停或永久封禁：',
          items: [
            '使用服务进行任何非法活动',
            '试图破解、反编译或逆向工程我们的软件',
            '上传恶意软件或病毒',
            '骚扰其他用户或我们的员工',
            '创建虚假账户或冒充他人',
            '滥用客服系统或发送垃圾邮件',
            '违反知识产权法律',
            '干扰或破坏服务的正常运行'
          ]
        },
        intellectualProperty: {
          title: '知识产权',
          content: 'Dopamind 应用程序、其内容、功能和特色（包括但不限于信息、软件、文本、显示、图像、视频和音频，以及其设计、选择和排列）均为我们或我们的许可方所有，受版权、商标、专利和其他知识产权法律保护。',
          userContent: '您保留对您创建的任务、笔记和其他用户内容的所有权。通过使用我们的服务，您授予我们处理、存储和同步这些内容以提供服务的权利。'
        },
        paidServices: {
          title: '付费服务和计费',
          items: [
            {
              title: '订阅模式',
              description: '我们提供免费试用和付费订阅服务。订阅将自动续费，除非您在当前计费周期结束前取消。'
            },
            {
              title: '价格变更',
              description: '我们保留随时更改订阅价格的权利，但会提前至少30天通知现有用户。'
            },
            {
              title: '退款政策',
              description: '根据应用商店的政策，某些情况下可能提供退款。具体请参考您购买平台的退款条款。'
            },
            {
              title: '免费试用',
              description: '新用户享有7天免费试用期。试用期结束后，如不取消将自动转为付费订阅。'
            }
          ]
        },
        disclaimer: {
          title: '免责声明',
          content: '我们的服务按"现状"提供，不提供任何明示或暗示的保证：',
          items: [
            '我们不保证服务的无中断或无错误运行',
            'AI 建议仅供参考，不构成专业医疗或心理健康建议',
            '您应该根据自己的判断使用 AI 提供的建议',
            '对于因使用或无法使用服务而造成的任何损失，我们不承担责任',
            '我们不对第三方内容或服务负责'
          ]
        },
        serviceChanges: {
          title: '服务变更和终止',
          content: '我们保留随时修改、暂停或终止服务的权利，恕不另行通知。我们也可能需要定期进行维护，期间服务可能暂时不可用。',
          terminationConditions: [
            '违反本服务条款',
            '涉嫌欺诈或滥用',
            '长期不活跃的账户',
            '应法律要求或监管命令',
            '服务不再商业可行'
          ]
        },
        governingLaw: {
          title: '适用法律',
          content: '本服务条款受新加坡法律管辖。如发生争议，双方同意首先通过友好协商解决；协商不成的，应提交至新加坡仲裁中心进行仲裁。'
        },
        contact: {
          title: '联系我们',
          subtitle: '如果您对本服务条款有任何疑问，请联系我们：',
          email: 'legal@dopamind.com',
          support: 'support@dopamind.com',
          responseTime: '我们会在收到您的询问后7个工作日内回复。'
        }
      }
    },
    paymentSuccess: {
      title: '🎉 支付成功！',
      subtitle: '欢迎成为 Dopamind Premium 用户',
      membershipActivated: 'Premium 会员已激活',
      paymentDetails: '支付详情',
      paymentStatus: '支付状态：',
      paid: '已支付',
      subscriptionId: '订阅ID：',
      sessionId: '支付会话：',
      premiumFeatures: '您现在可以享受的 Premium 功能',
      features: [
        'AI 对话式规划 - 像聊天一样安排一切',
        '沉浸式专注圣所 - 屏蔽干扰，进入心流状态',
        'AI 智能拆解 - 将复杂项目分解为小步骤',
        '多设备云端同步 - 所有数据，永不丢失',
        '可视化成长报告 - 用热力图见证进步'
      ],
      startUsing: '开始使用 Premium 功能',
      manageSubscription: '管理我的订阅',
      thankYou: '感谢您选择 Dopamind Premium！',
      support: '客服支持',
      confirmingPayment: '正在确认支付状态...',
      missingSessionId: '缺少支付会话ID',
      fetchError: '获取支付详情失败，但您的支付已成功处理'
    },
    paymentCancelled: {
      title: '支付已取消',
      subtitle: '没关系，您可以随时重新开始',
      incompletePayment: '未完成支付',
      whatHappened: '发生了什么？',
      explanation: [
        '您的支付过程被中断或取消',
        '没有产生任何费用',
        '您的账户状态保持不变',
        '可以随时重新尝试购买'
      ],
      whyPremium: '为什么选择 Premium？',
      premiumFeatures: [
        '🧠 AI 对话式规划 - 像聊天一样安排生活',
        '🎯 沉浸式专注模式 - 告别拖延症',
        '📊 可视化成长报告 - 见证每天的进步',
        '☁️ 多设备云端同步 - 随时随地访问',
        '🎮 智能游戏化系统 - 让自律变得有趣'
      ],
      retryPayment: '重新选择订阅计划',
      backToHome: '返回首页',
      contactSupport: '联系客服',
      tip: '💡 小贴士',
      savings: '年度订阅可节省 2 个月费用，相当于 88 折优惠！还能获得专属会员社群访问权限。'
    },
    accountDeletion: {
      title: 'Dopamind 账户与数据删除指南',
      subtitle: '了解如何永久删除您的 Dopamind 账户和所有相关数据',
      appInfo: {
        title: '应用信息',
        appName: '应用名称',
        developer: '开发者名称',
        contact: '联系邮箱'
      },
      steps: {
        title: '账户删除步骤',
        items: [
          {
            number: 1,
            title: '打开 Dopamind 应用并登录',
            description: '确保您已经登录到需要删除的账户'
          },
          {
            number: 2,
            title: '前往「我的」页面',
            description: '在应用底部导航栏中点击「我的」(Profile) 页面'
          },
          {
            number: 3,
            title: '点击「账户信息」',
            description: '在个人页面中找到并点击「账户信息」(Account Info)'
          },
          {
            number: 4,
            title: '点击「永久删除账户」按钮',
            description: '在账户信息页面底部，点击红色的「永久删除账户」(Permanently Delete Account) 按钮'
          },
          {
            number: 5,
            title: '输入密码进行最终确认',
            description: '按照屏幕提示，输入您的账户密码进行最终确认删除操作'
          }
        ]
      },
      dataInfo: {
        title: '重要数据说明',
        warning: '请注意：删除账户是一个不可逆转的操作！',
        description: '一旦确认删除，将会永久删除您的所有个人信息和数据，且无法恢复。',
        deletedData: {
          title: '以下数据将被永久删除：',
          items: [
            '所有个人信息（昵称、邮箱、头像等）',
            '所有任务记录和完成历史',
            '所有习惯数据和追踪记录',
            '所有专注会话记录',
            '与 AI 教练的聊天历史',
            '应用偏好设置和自定义配置',
            '订阅和付费记录',
            '其他所有与您账户关联的数据'
          ]
        }
      },
      confirmation: {
        title: '确认要求',
        description: '为确保账户安全，删除操作需要满足以下条件：',
        requirements: [
          '输入当前账户的登录密码',
          '确认您理解此操作的不可逆性',
          '同意放弃所有相关数据的恢复权利'
        ]
      },
      support: {
        title: '需要帮助？',
        description: '如果您在删除过程中遇到任何问题，或有任何疑问，请联系我们的支持团队：',
        subject: '邮件主题',
        subjectText: '账户删除相关问题',
        responseTime: '我们会在 24-48 小时内回复您的邮件'
      },
      alternatives: {
        title: '删除前的其他选择',
        description: '在永久删除账户之前，您也可以考虑以下替代方案：',
        options: [
          {
            title: '暂停使用',
            description: '您可以删除应用但保留账户，随时可以重新安装并恢复数据'
          },
          {
            title: '数据导出',
            description: '联系支持团队导出您的个人数据备份'
          },
          {
            title: '取消订阅',
            description: '如果只是想停止付费，可以单独取消订阅而不删除账户'
          },
          {
            title: '联系支持',
            description: '如果遇到问题，我们的团队很乐意为您提供帮助'
          }
        ]
      }
    }
  },
  en: {
    navigation: {
      home: 'Home',
      features: 'Features',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      support: 'Support'
    },
    auth: {
      login: 'Login',
      register: 'Sign Up',
      dashboard: 'Dashboard',
      logout: 'Logout'
    },
    login: {
      title: 'Sign in to your account',
      email: 'Email address',
      password: 'Password',
      loginButton: 'Sign in',
      loggingIn: 'Signing in...',
      createAccount: 'Create new account',
      backToHome: 'Back to home',
      or: 'or'
    },
    register: {
      title: 'Create your account',
      nickname: 'Nickname',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      referralCode: 'Referral code (optional)',
      registerButton: 'Sign up',
      registering: 'Signing up...',
      alreadyHaveAccount: 'Already have an account?',
      backToHome: 'Back to home',
      or: 'or',
      errors: {
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        nicknameEmpty: 'Nickname cannot be empty',
        nicknameTooLong: 'Nickname cannot exceed 20 characters'
      }
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Learn how we protect your personal information',
      lastUpdated: 'Last Updated',
      sections: {
        introduction: {
          title: 'Introduction',
          content: 'We value your privacy. This privacy policy explains how we collect, use and protect your personal information.'
        },
        dataCollection: {
          title: 'Data Collection',
          subtitle: 'We collect the following types of information:',
          directInfo: {
            title: 'Information you provide directly',
            items: [
              'Account information (email, username, password)',
              'Profile information (name, avatar, etc.)',
              'Tasks and notes content you create',
              'Communication records with our customer service'
            ]
          },
          autoInfo: {
            title: 'Automatically collected information',
            items: [
              'Device information (OS, device model, etc.)',
              'Usage statistics (feature usage frequency, session duration, etc.)',
              'Technical information (IP address, browser type, etc.)',
              'Error logs and performance data'
            ]
          }
        },
        dataUsage: {
          title: 'Data Usage',
          items: [
            {
              title: 'Service Provision',
              description: 'Process your task management, AI suggestions and other core features'
            },
            {
              title: 'Product Improvement',
              description: 'Analyze usage patterns to optimize user experience'
            },
            {
              title: 'Customer Support',
              description: 'Respond to your questions and technical support requests'
            },
            {
              title: 'Security Protection',
              description: 'Detect and prevent fraud, abuse and other inappropriate behavior'
            }
          ]
        },
        dataSharing: {
          title: 'Data Sharing',
          promise: 'We promise not to sell, rent or trade your personal information to any third parties.',
          exceptions: [
            'With your explicit consent',
            'To comply with laws, court orders or government requirements',
            'To protect our or others\' rights, property or safety',
            'With service providers (such as cloud providers), but they can only use data as instructed by us'
          ]
        },
        dataSecurity: {
          title: 'Data Security',
          subtitle: 'We employ multi-layered security measures to protect your data:',
          measures: [
            {
              title: 'Encrypted Storage',
              description: 'Sensitive data uses industry-standard encryption technology'
            },
            {
              title: 'Access Control',
              description: 'Strictly limit employee access to user data'
            },
            {
              title: 'Security Audits',
              description: 'Regular security assessments and vulnerability testing'
            }
          ]
        },
        userRights: {
          title: 'Your Rights',
          subtitle: 'Under applicable privacy laws, you have the following rights:',
          rights: [
            {
              title: 'Right of Access',
              description: 'You can request to view the personal information we hold about you'
            },
            {
              title: 'Right of Rectification',
              description: 'You can request us to correct inaccurate or incomplete information'
            },
            {
              title: 'Right of Erasure',
              description: 'In certain circumstances, you can request us to delete your personal information'
            },
            {
              title: 'Right to Data Portability',
              description: 'You can request to receive your data in a structured format'
            }
          ]
        },
        childrenPrivacy: {
          title: 'Children\'s Privacy',
          content: 'Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately.'
        },
        policyChanges: {
          title: 'Policy Changes',
          content: 'We may update this privacy policy from time to time. When we make significant changes, we will notify you through the following methods:',
          methods: [
            'Send notifications within the app',
            'Send emails to your registered email address',
            'Post announcements on our website'
          ]
        },
        contact: {
          title: 'Contact Us',
          subtitle: 'If you have any questions about this privacy policy or need to exercise your rights, please contact us:',
          email: 'privacy@dopamind.com',
          support: 'support@dopamind.com',
          responseTime: 'We promise to respond to your inquiry within 7 business days.'
        }
      }
    },
    support: {
      title: 'Help Center',
      subtitle: 'We are here to help you',
      contact: {
        email: {
          title: 'Email Support',
          description: 'Send email to support@dopamind.com',
          response: 'Reply within 24 hours'
        },
        feedback: {
          title: 'Product Feedback',
          description: 'Share your suggestions and ideas'
        },
        guide: {
          title: 'Documentation',
          description: 'View detailed feature instructions'
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        categories: {
          account: 'Account Related'
        },
        items: [
          {
            question: 'How to get started with Dopamind?',
            answer: 'After downloading the app, simply register an account to get started. The system will automatically provide a 7-day free trial.'
          },
          {
            question: 'Which platforms are supported?',
            answer: 'Currently supports iOS platform, Android version is under development.'
          },
          {
            question: 'Is my data secure?',
            answer: 'Yes, we use enterprise-grade encryption to protect your data, all information is securely stored in the cloud.'
          },
          {
            question: 'Can I cancel my subscription?',
            answer: 'You can cancel your subscription anytime in settings, and continue using until the current billing period ends.'
          }
        ]
      },
      guides: {
        title: 'Feature Guides',
        quickStart: {
          title: 'Quick Start',
          description: 'Learn Dopamind&apos;s core features in 5 minutes'
        },
        aiCoach: {
          title: 'AI Coach',
          description: 'How to communicate effectively with AI for best advice'
        },
        focus: {
          title: 'Focus Mode',
          description: 'Pomodoro technique and deep work tips'
        }
      },
      stillNeedHelp: {
        title: 'Still Need Help?',
        subtitle: 'Our support team is always here for you, usually responding within 24 hours.',
        sendEmail: 'Send Email',
        responseTime: 'We typically respond within 24-48 hours'
      }
    },
    footer: {
      description: 'AI focus companion designed for ADHD users',
      copyright: 'All rights reserved',
      sections: {
        product: 'Product',
        support: 'Support',
        legal: 'Legal'
      },
      links: {
        features: 'Features',
        pricing: 'Pricing',
        supportCenter: 'Help Center',
        contactUs: 'Contact Us',
        status: 'Status Page',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy',
        accountDeletion: 'Account Deletion'
      }
    },
    home: {
      hero: {
        badge: 'Designed for ADHD Users',
        title: 'AI Companion',
        titleHighlight: 'Designed for ADHD',
        subtitle: 'Transform your scattered thoughts into clear actions. Manage your entire life through the most natural way—conversation.',
        downloadText: 'Download now, new users get 7-day free Premium trial'
      },
      features: {
        section1: {
          title: 'Plan with Confidence',
          subtitle: 'Say goodbye to chaotic to-do lists. Dopamind\'s intelligent task system automatically categorizes, prioritizes, and motivates you with visual statistics. See priorities at a glance and tackle each day with ease.',
          points: [
            'Smart task categorization and priority sorting',
            'Progress visualization for continuous motivation',
            'Eliminate the "where to start" confusion'
          ]
        },
        section2: {
          title: 'Think It, Say It, Get It Done',
          subtitle: 'No more tedious manual input. Just speak your thoughts, and AI will understand and instantly create tasks for you. Voice input supported for the most natural way to organize everything.',
          points: [
            'Smart voice recognition with precise intent understanding',
            'Natural conversational interaction, no learning curve',
            'Instant task creation without interrupting your flow'
          ]
        }
      },
      howItWorks: {
        section1: {
          title: 'AI Smart Breakdown, Beat Procrastination',
          subtitle: 'Complex projects? Let AI break them down into small steps. Each sub-task is clear and actionable, making "getting started" simple and "finishing" possible.',
          example: {
            title: 'Example: Preparing for Interview',
            steps: [
              '1. Prepare a clean resume',
              '2. Research company background',
              '3. Prepare answers to common interview questions'
            ]
          }
        },
        section2: {
          title: 'Immersive Focus Mode',
          subtitle: 'Block distractions, enter flow state. Focus timer with gentle reminders helps you build efficient work rhythm where every minute counts.',
          stats: [
            { value: '25', label: 'min focus' },
            { value: '5', label: 'min break' },
            { value: '4', label: 'cycles' }
          ]
        }
      },
      globalView: {
        title: 'Bird&apos;s Eye View of Your Master Plan',
        subtitle: 'Tasks are no longer isolated dots, but clear timelines visible on your calendar. Intuitively review the past, plan the future. AI can also generate personalized daily reports based on your day&apos;s activities, providing deep insights.',
        badges: ['AI Daily Reports', 'Smart Reminders']
      },
      beyondTasks: {
        title: 'Beyond Tasks, Your Life Operating System',
        subtitle: 'Dopamind doesn&apos;t just help you manage work, it cares about your entire life quality',
        features: [
          {
            title: 'Habit Building',
            description: 'Witness the power of compound interest through heat maps, building positive dopamine loops. Every small habit is a stepping stone to a better you.'
          },
          {
            title: 'Smart Fridge Manager',
            description: 'Easily record ingredients, smart expiration reminders. Say goodbye to "expiry surprises" and make healthy eating simple and controllable.'
          },
          {
            title: 'Subscription Tracking',
            description: 'Easily track all subscription services, avoid unexpected charges. Control every subscription and make financial management transparent and simple.'
          }
        ]
      },
      cloudSync: {
        title: 'Cloud Sync, Anywhere, Anytime',
        subtitle: 'Your data is securely stored in the cloud and seamlessly synced across all devices, making your life management unrestricted by devices.',
        features: [
          {
            title: 'Real-time Sync',
            description: 'Tasks added on your phone instantly appear on your tablet and computer. Cross-device collaboration keeps your plans always up-to-date.'
          },
          {
            title: 'Secure Backup',
            description: 'Enterprise-grade encryption protects your private data, automatic backup prevents accidental loss. Your information security is our top priority.'
          },
          {
            title: 'Cloud Sync',
            description: 'Seamlessly sync data across all devices, never lose anything. Access complete tasks and data no matter which device you use.'
          }
        ]
      },
      pricing: {
        title: 'Choose Your Perfect Plan',
        subtitle: 'Unlock full features, start your efficient lifestyle',
        plans: {
          monthly: {
            title: 'Monthly',
            price: '$14.99',
            period: 'USD / month',
            features: [
              'All premium features',
              'Unlimited tasks and projects',
              'Cloud sync backup',
              'AI smart suggestions'
            ]
          },
          yearly: {
            title: 'Yearly',
            price: '$159.99',
            period: 'USD / year',
            badge: 'Most Popular',
            discount: 'Save 12%',
            features: [
              'All premium features',
              'Unlimited tasks and projects',
              'Cloud sync backup',
              'AI smart suggestions',
              'Priority customer support'
            ]
          }
        },
        cta: {
          monthly: 'Subscribe to Monthly Plan',
          yearly: 'Subscribe to Yearly Plan',
          trial: 'New users get 7-day free trial • Cancel anytime'
        }
      },
      finalCta: {
        title: 'Ready to Transform Chaos into Clarity?',
        subtitle: 'Download Dopamind now and let AI become your most understanding companion. Start a new focused and efficient lifestyle.',
        trial: 'New users get 7-day free trial • Cancel anytime',
        users: 'Join over 10,000 satisfied users',
        termsAndPrivacy: 'By using Dopamind, you agree to our {terms} and {privacy}.',
        termsLink: 'Terms of Service',
        privacyLink: 'Privacy Policy',
        termsUrl: 'Terms of Service: https://dopamind.app/terms',
        privacyUrl: 'Privacy Policy: https://dopamind.app/privacy',
        stats: [
          { value: '10K+', label: 'Active Users' },
          { value: '95%', label: 'User Satisfaction' },
          { value: '4.9', label: 'App Store Rating' }
        ]
      }
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Please read these terms carefully before using Dopamind services',
      lastUpdated: 'Last updated',
      sections: {
        acceptance: {
          title: 'Acceptance of Terms',
          content: 'Welcome to Dopamind! By accessing or using our application and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
        },
        serviceDescription: {
          title: 'Service Description',
          content: 'Dopamind is an AI companion app designed for ADHD users, providing task management, focus mode, habit tracking and other features.',
          features: {
            title: 'Our main features include:',
            items: [
              'AI conversational task management',
              'Smart task breakdown and priority sorting',
              'Focus mode and Pomodoro technique',
              'Habit tracking and data visualization',
              'Cloud data synchronization',
              'Multi-platform support'
            ]
          }
        },
        userResponsibilities: {
          title: 'User Responsibilities',
          subtitle: 'When using our services, you are responsible for:',
          items: [
            {
              title: 'Account Security',
              description: 'You are responsible for protecting your account password and login information, and must not share your account with others.'
            },
            {
              title: 'Content Accuracy',
              description: 'All information you provide should be true, accurate, complete and up-to-date.'
            },
            {
              title: 'Lawful Use',
              description: 'You must comply with all applicable laws and regulations and not use the service for illegal purposes.'
            },
            {
              title: 'Respect Others',
              description: 'When interacting with customer service or other users, you should be polite and respectful.'
            }
          ]
        },
        prohibitedUses: {
          title: 'Prohibited Conduct',
          warning: 'The following behaviors are strictly prohibited and violators will face account suspension or permanent banning:',
          items: [
            'Using the service for any illegal activities',
            'Attempting to hack, decompile or reverse engineer our software',
            'Uploading malware or viruses',
            'Harassing other users or our staff',
            'Creating fake accounts or impersonating others',
            'Abusing customer service system or sending spam',
            'Violating intellectual property laws',
            'Interfering with or disrupting normal service operation'
          ]
        },
        intellectualProperty: {
          title: 'Intellectual Property',
          content: 'The Dopamind application, its content, functionality and features (including but not limited to information, software, text, displays, images, video and audio, and their design, selection and arrangement) are owned by us or our licensors and are protected by copyright, trademark, patent and other intellectual property laws.',
          userContent: 'You retain ownership of the tasks, notes and other user content you create. By using our service, you grant us the right to process, store and synchronize this content to provide the service.'
        },
        paidServices: {
          title: 'Paid Services and Billing',
          items: [
            {
              title: 'Subscription Model',
              description: 'We offer free trial and paid subscription services. Subscriptions will automatically renew unless you cancel before the end of the current billing cycle.'
            },
            {
              title: 'Price Changes',
              description: 'We reserve the right to change subscription prices at any time, but will provide at least 30 days notice to existing users.'
            },
            {
              title: 'Refund Policy',
              description: 'Refunds may be available in certain circumstances according to app store policies. Please refer to your purchase platform\'s refund terms.'
            },
            {
              title: 'Free Trial',
              description: 'New users enjoy a 7-day free trial period. After the trial ends, it will automatically convert to a paid subscription if not cancelled.'
            }
          ]
        },
        disclaimer: {
          title: 'Disclaimer',
          content: 'Our services are provided "as is" without any express or implied warranties:',
          items: [
            'We do not guarantee uninterrupted or error-free service operation',
            'AI suggestions are for reference only and do not constitute professional medical or mental health advice',
            'You should use AI-provided suggestions based on your own judgment',
            'We are not liable for any losses caused by using or inability to use the service',
            'We are not responsible for third-party content or services'
          ]
        },
        serviceChanges: {
          title: 'Service Changes and Termination',
          content: 'We reserve the right to modify, suspend or terminate services at any time without notice. We may also need to perform regular maintenance during which services may be temporarily unavailable.',
          terminationConditions: [
            'Violation of these Terms of Service',
            'Suspected fraud or abuse',
            'Long-term inactive accounts',
            'Legal requirements or regulatory orders',
            'Service is no longer commercially viable'
          ]
        },
        governingLaw: {
          title: 'Governing Law',
          content: 'These Terms of Service are governed by Singapore law. In case of disputes, both parties agree to first resolve through friendly negotiation; if negotiation fails, disputes shall be submitted to Singapore Arbitration Centre for arbitration.'
        },
        contact: {
          title: 'Contact Us',
          subtitle: 'If you have any questions about these Terms of Service, please contact us:',
          email: 'legal@dopamind.com',
          support: 'support@dopamind.com',
          responseTime: 'We will respond to your inquiry within 7 business days.'
        }
      }
    },
    paymentSuccess: {
      title: '🎉 Payment Successful!',
      subtitle: 'Welcome to Dopamind Premium',
      membershipActivated: 'Premium Membership Activated',
      paymentDetails: 'Payment Details',
      paymentStatus: 'Payment Status:',
      paid: 'Paid',
      subscriptionId: 'Subscription ID:',
      sessionId: 'Payment Session:',
      premiumFeatures: 'Premium Features You Can Now Enjoy',
      features: [
        'AI Conversational Planning - Arrange everything like a chat',
        'Immersive Focus Sanctuary - Block distractions, enter flow state',
        'AI Smart Breakdown - Break complex projects into small steps',
        'Multi-device Cloud Sync - All data, never lost',
        'Visual Growth Reports - Witness progress with heat maps'
      ],
      startUsing: 'Start Using Premium Features',
      manageSubscription: 'Manage My Subscription',
      thankYou: 'Thank you for choosing Dopamind Premium!',
      support: 'Customer Support',
      confirmingPayment: 'Confirming payment status...',
      missingSessionId: 'Missing payment session ID',
      fetchError: 'Failed to fetch payment details, but your payment was processed successfully'
    },
    paymentCancelled: {
      title: 'Payment Cancelled',
      subtitle: 'No worries, you can restart anytime',
      incompletePayment: 'Payment Incomplete',
      whatHappened: 'What happened?',
      explanation: [
        'Your payment process was interrupted or cancelled',
        'No charges were made',
        'Your account status remains unchanged',
        'You can retry the purchase anytime'
      ],
      whyPremium: 'Why Choose Premium?',
      premiumFeatures: [
        '🧠 AI Conversational Planning - Arrange life like chatting',
        '🎯 Immersive Focus Mode - Say goodbye to procrastination',
        '📊 Visual Growth Reports - Witness daily progress',
        '☁️ Multi-device Cloud Sync - Access anywhere, anytime',
        '🎮 Smart Gamification System - Make self-discipline fun'
      ],
      retryPayment: 'Choose Subscription Plan Again',
      backToHome: 'Back to Home',
      contactSupport: 'Contact Support',
      tip: '💡 Tip',
      savings: 'Annual subscription saves 2 months\' cost, equivalent to 12% off! Plus exclusive member community access.'
    },
    accountDeletion: {
      title: 'Dopamind Account & Data Deletion Guide',
      subtitle: 'Learn how to permanently delete your Dopamind account and all related data',
      appInfo: {
        title: 'App Information',
        appName: 'App Name',
        developer: 'Developer Name',
        contact: 'Contact Email'
      },
      steps: {
        title: 'Account Deletion Steps',
        items: [
          {
            number: 1,
            title: 'Open Dopamind app and log in',
            description: 'Make sure you are logged into the account you want to delete'
          },
          {
            number: 2,
            title: 'Go to "Profile" page',
            description: 'Tap on "Profile" in the bottom navigation bar of the app'
          },
          {
            number: 3,
            title: 'Tap "Account Info"',
            description: 'Find and tap "Account Info" on your profile page'
          },
          {
            number: 4,
            title: 'Tap "Permanently Delete Account" button',
            description: 'At the bottom of the account info page, tap the red "Permanently Delete Account" button'
          },
          {
            number: 5,
            title: 'Enter password for final confirmation',
            description: 'Follow the on-screen prompts and enter your account password to confirm the deletion'
          }
        ]
      },
      dataInfo: {
        title: 'Important Data Information',
        warning: 'Please note: Account deletion is an irreversible operation!',
        description: 'Once confirmed, all your personal information and data will be permanently deleted and cannot be recovered.',
        deletedData: {
          title: 'The following data will be permanently deleted:',
          items: [
            'All personal information (nickname, email, avatar, etc.)',
            'All task records and completion history',
            'All habit data and tracking records',
            'All focus session records',
            'Chat history with AI coach',
            'App preferences and custom configurations',
            'Subscription and payment records',
            'All other data associated with your account'
          ]
        }
      },
      confirmation: {
        title: 'Confirmation Requirements',
        description: 'To ensure account security, the deletion operation requires the following conditions:',
        requirements: [
          'Enter your current account login password',
          'Confirm that you understand the irreversible nature of this operation',
          'Agree to waive all rights to data recovery'
        ]
      },
      support: {
        title: 'Need Help?',
        description: 'If you encounter any problems during the deletion process or have any questions, please contact our support team:',
        subject: 'Email Subject',
        subjectText: 'Account Deletion Related Issue',
        responseTime: 'We will reply to your email within 24-48 hours'
      },
      alternatives: {
        title: 'Other Options Before Deletion',
        description: 'Before permanently deleting your account, you may also consider the following alternatives:',
        options: [
          {
            title: 'Pause Usage',
            description: 'You can delete the app but keep your account, and reinstall to restore data anytime'
          },
          {
            title: 'Data Export',
            description: 'Contact support team to export a backup of your personal data'
          },
          {
            title: 'Cancel Subscription',
            description: 'If you just want to stop payments, you can cancel subscription separately without deleting account'
          },
          {
            title: 'Contact Support',
            description: 'If you encounter problems, our team is happy to help you'
          }
        ]
      }
    }
  },
  ja: {
    navigation: {
      home: 'ホーム',
      features: '機能',
      howItWorks: '使い方',
      pricing: '料金',
      support: 'サポート'
    },
    auth: {
      login: 'ログイン',
      register: '新規登録',
      dashboard: 'ダッシュボード',
      logout: 'ログアウト'
    },
    login: {
      title: 'アカウントにログイン',
      email: 'メールアドレス',
      password: 'パスワード',
      loginButton: 'ログイン',
      loggingIn: 'ログイン中...',
      createAccount: '新しいアカウントを作成',
      backToHome: 'ホームに戻る',
      or: 'または'
    },
    register: {
      title: 'アカウントを作成',
      nickname: 'ニックネーム',
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      referralCode: '紹介コード（任意）',
      registerButton: '新規登録',
      registering: '登録中...',
      alreadyHaveAccount: '既にアカウントをお持ちですか？',
      backToHome: 'ホームに戻る',
      or: 'または',
      errors: {
        passwordMismatch: 'パスワードが一致しません',
        passwordTooShort: 'パスワードは6文字以上である必要があります',
        nicknameEmpty: 'ニックネームを入力してください',
        nicknameTooLong: 'ニックネームは20文字以内である必要があります'
      }
    },
    privacy: {
      title: 'プライバシーポリシー',
      subtitle: '個人情報の保護について',
      lastUpdated: '最終更新',
      sections: {
        introduction: {
          title: '紹介',
          content: '私たちはあなたのプライバシーを大切にします。このプライバシーポリシーは、個人情報の収集、使用、保護方法について説明します。'
        },
        dataCollection: {
          title: 'データ収集',
          subtitle: '以下の種類の情報を収集します：',
          directInfo: {
            title: '直接提供していただく情報',
            items: [
              'アカウント情報（メール、ユーザー名、パスワード）',
              'プロフィール情報（名前、アバターなど）',
              '作成したタスクやメモの内容',
              'カスタマーサービスとのやり取り記録'
            ]
          },
          autoInfo: {
            title: '自動的に収集される情報',
            items: [
              'デバイス情報（OS、デバイスモデルなど）',
              '使用統計（機能使用頻度、セッション時間など）',
              '技術情報（IPアドレス、ブラウザタイプなど）',
              'エラーログとパフォーマンスデータ'
            ]
          }
        },
        dataUsage: {
          title: 'データ使用',
          items: [
            {
              title: 'サービス提供',
              description: 'タスク管理、AI提案などの核心機能を処理'
            },
            {
              title: '製品改善',
              description: 'ユーザー体験を最適化するための使用パターン分析'
            },
            {
              title: 'カスタマーサポート',
              description: 'お客様の質問や技術サポート要求への対応'
            },
            {
              title: 'セキュリティ保護',
              description: '詐欺、悪用などの不適切な行為の検出と防止'
            }
          ]
        },
        dataSharing: {
          title: 'データ共有',
          promise: '個人情報を第三者に販売、賃貸、取引することはありません。',
          exceptions: [
            'お客様の明示的な同意がある場合',
            '法律、裁判所命令、政府要求に従う場合',
            '当社または他者の権利、財産、安全を保護する場合',
            'サービスプロバイダー（クラウドプロバイダーなど）との協力時（当社の指示に従う場合のみ）'
          ]
        },
        dataSecurity: {
          title: 'データセキュリティ',
          subtitle: 'データ保護のため多層的なセキュリティ対策を採用：',
          measures: [
            {
              title: '暗号化ストレージ',
              description: '機密データは業界標準の暗号化技術を使用'
            },
            {
              title: 'アクセス制御',
              description: '従業員のユーザーデータへのアクセスを厳格制限'
            },
            {
              title: 'セキュリティ監査',
              description: '定期的なセキュリティ評価と脆弱性テスト'
            }
          ]
        },
        userRights: {
          title: 'お客様の権利',
          subtitle: '適用されるプライバシー法に基づき、以下の権利があります：',
          rights: [
            {
              title: 'アクセス権',
              description: '当社が保有するお客様の個人情報の閲覧を要求できます'
            },
            {
              title: '訂正権',
              description: '不正確または不完全な情報の訂正を要求できます'
            },
            {
              title: '削除権',
              description: '特定の状況下で個人情報の削除を要求できます'
            },
            {
              title: 'データポータビリティ権',
              description: '構造化された形式でデータを受け取ることを要求できます'
            }
          ]
        },
        childrenPrivacy: {
          title: '児童のプライバシー',
          content: '当サービスは13歳未満の児童を対象としていません。13歳未満の児童から故意に個人情報を収集することはありません。このような情報を収集したことが判明した場合、直ちに削除いたします。'
        },
        policyChanges: {
          title: 'ポリシー変更',
          content: 'このプライバシーポリシーを随時更新する場合があります。重要な変更を行う際は、以下の方法でお知らせします：',
          methods: [
            'アプリ内通知の送信',
            '登録メールアドレスへのメール送信',
            'ウェブサイトでのお知らせ掲載'
          ]
        },
        contact: {
          title: 'お問い合わせ',
          subtitle: 'このプライバシーポリシーについてご質問がある場合や権利を行使したい場合は、お問い合わせください：',
          email: 'privacy@dopamind.com',
          support: 'support@dopamind.com',
          responseTime: 'お問い合わせから7営業日以内にご回答いたします。'
        }
      }
    },
    support: {
      title: 'ヘルプセンター',
      subtitle: 'いつでもサポートいたします',
      contact: {
        email: {
          title: 'メールサポート',
          description: 'support@dopamind.com にメール送信',
          response: '24時間以内に返信'
        },
        feedback: {
          title: '製品フィードバック',
          description: 'ご提案やアイデアをお聞かせください'
        },
        guide: {
          title: '使用説明書',
          description: '詳細な機能説明をご覧ください'
        }
      },
      faq: {
        title: 'よくある質問',
        categories: {
          account: 'アカウント関連'
        },
        items: [
          {
            question: 'Dopamindの使用を開始するには？',
            answer: 'アプリをダウンロード後、アカウント登録するだけで開始できます。システムが自動的に7日間無料試用を提供します。'
          },
          {
            question: 'どのプラットフォームがサポートされていますか？',
            answer: '現在iOSプラットフォームをサポート、Androidバージョンは開発中です。'
          },
          {
            question: 'データは安全ですか？',
            answer: 'はい、エンタープライズレベルの暗号化技術でデータを保護し、すべての情報はクラウドに安全に保存されています。'
          },
          {
            question: 'サブスクリプションをキャンセルできますか？',
            answer: '設定でいつでもサブスクリプションをキャンセルでき、現在の課金期間終了まで利用を続けられます。'
          }
        ]
      },
      guides: {
        title: '機能ガイド',
        quickStart: {
          title: 'クイックスタート',
          description: '5分でDopamindの核心機能を理解'
        },
        aiCoach: {
          title: 'AIコーチ',
          description: 'AIと効果的にコミュニケーションして最良のアドバイスを得る方法'
        },
        focus: {
          title: 'フォーカスモード',
          description: 'ポモドーロテクニックと深い作業のコツ'
        }
      },
      stillNeedHelp: {
        title: 'それでもサポートが必要ですか？',
        subtitle: 'サポートチームがいつでもお手伝いします。通常24時間以内に返信いたします。',
        sendEmail: 'メール送信',
        responseTime: '通常24-48時間以内に返信いたします'
      }
    },
    footer: {
      description: 'ADHD用户向けに設計されたAI集中パートナー',
      copyright: '全権利保留',
      sections: {
        product: '製品',
        support: 'サポート',
        legal: '法的事項'
      },
      links: {
        features: '機能',
        pricing: '料金',
        supportCenter: 'ヘルプセンター',
        contactUs: 'お問い合わせ',
        status: 'ステータスページ',
        privacy: 'プライバシーポリシー',
        terms: '利用規約',
        cookies: 'Cookieポリシー',
        accountDeletion: 'アカウント削除'
      }
    },
    home: {
      hero: {
        badge: 'ADHD用户向けに設計',
        title: 'ADHD向けに設計された',
        titleHighlight: 'AIパートナー',
        subtitle: '散らばった思考を明確な行動に変える。最も自然な方法—会話で、あなたの人生全体を管理します。',
        downloadText: '今すぐダウンロード、新規ユーザー登録で7日間無料プレミアム試用'
      },
      features: {
        section1: {
          title: '計画、余裕を持って',
          subtitle: '散らかったToDoリストに別れを告げましょう。Dopamindのインテリジェントタスクシステムが自動的に分類・優先順位付けし、視覚的な統計でモチベーションを向上させます。重要なことが一目でわかり、毎日を楽に対処できます。',
          points: [
            'スマートタスク分類と優先順位設定',
            '進捗の可視化で継続的なモチベーション',
            '「どこから始めればいいかわからない」悩みを解消'
          ]
        },
        section2: {
          title: '思ったら言うだけ、すぐ実行',
          subtitle: '面倒な手動入力はもう不要。あなたの考えを話すだけで、AIが理解し、即座にタスクを作成します。音声入力対応で、最も自然な方法ですべてを整理できます。',
          points: [
            'スマート音声認識で意図を正確に理解',
            '自然な会話式インタラクション、学習コスト不要',
            '思考を中断せずに即座にタスク作成'
          ]
        }
      },
      howItWorks: {
        section1: {
          title: 'AI スマートな分解で先延ばしを撃退',
          subtitle: '複雑なプロジェクト？AIが小さなステップに分解します。各サブタスクは明確で実行可能、「始める」ことを簡単に、「完了」を可能にします。',
          example: {
            title: '例：面接準備',
            steps: [
              '1. きれいな履歴書を準備',
              '2. 会社の背景情報を調査',
              '3. よくある面接質問の回答を準備'
            ]
          }
        },
        section2: {
          title: '没入型集中モード',
          subtitle: '妨害をブロックし、フロー状態に入る。優しいリマインダー付きの集中タイマーで効率的な作業リズムを構築、すべての分が価値あるものになります。',
          stats: [
            { value: '25', label: '分集中' },
            { value: '5', label: '分休憩' },
            { value: '4', label: '回サイクル' }
          ]
        }
      },
      globalView: {
        title: 'あなたの全体計画を鳥瞰',
        subtitle: 'タスクはもはや孤立した点ではなく、カレンダー上に明確に見えるタイムライン。過去を直感的に振り返り、未来を計画。AIはあなたの一日の活動に基づいて専用の日次レポートを生成し、深い洞察を提供します。',
        badges: ['AI日次レポート生成', 'スマートリマインダー']
      },
      beyondTasks: {
        title: 'タスクを超えて、あなたの生活OS',
        subtitle: 'Dopamindは仕事の管理だけでなく、あなたの生活の質全体をケアします',
        features: [
          {
            title: '習慣形成',
            description: 'ヒートマップで複利の力を見証し、ポジティブなドーパミンループを構築。小さな習慣一つ一つが、より良い自分への足がかりです。'
          },
          {
            title: 'スマート冷蔵庫マネージャー',
            description: '食材を手軽に記録、スマートな賞味期限リマインダー。「期限切れサプライズ」に別れを告げ、健康的な食事を簡単にコントロール。'
          },
          {
            title: 'サブスクリプション追跡',
            description: 'すべてのサブスクリプションサービスを簡単に追跡、予期しない請求を回避。すべてのサブスクリプションをコントロールし、財務管理を透明で簡単に。'
          }
        ]
      },
      cloudSync: {
        title: 'クラウド同期、いつでもどこでも',
        subtitle: 'あなたのデータはクラウドに安全に保存され、すべてのデバイス間でシームレスに同期。デバイスに制限されない生活管理を実現します。',
        features: [
          {
            title: 'リアルタイム同期',
            description: 'スマートフォンで追加したタスクが、即座にタブレットやコンピューターに表示。デバイス間連携で、計画を常に最新状態に保ちます。'
          },
          {
            title: 'セキュアバックアップ',
            description: 'エンタープライズレベルの暗号化でプライベートデータを保護、自動バックアップで偶発的な損失を防ぎます。あなたの情報セキュリティが最優先です。'
          },
          {
            title: 'クラウド同期',
            description: 'すべてのデバイス間でデータをシームレスに同期、何も失いません。どのデバイスを使用しても完全なタスクとデータにアクセス可能。'
          }
        ]
      },
      pricing: {
        title: 'あなたにぴったりのプランを選択',
        subtitle: 'すべての機能をアンロック、効率的なライフスタイルを始めましょう',
        plans: {
          monthly: {
            title: 'Monthly',
            price: '$14.99',
            period: 'USD / month',
            features: [
              'すべてのプレミアム機能',
              '無制限のタスクとプロジェクト',
              'クラウド同期バックアップ',
              'AIスマート提案'
            ]
          },
          yearly: {
            title: 'Yearly',
            price: '$159.99',
            period: 'USD / year',
            badge: 'Most Popular',
            discount: '12%節約',
            features: [
              'すべてのプレミアム機能',
              '無制限のタスクとプロジェクト',
              'クラウド同期バックアップ',
              'AIスマート提案',
              '優先カスタマーサポート'
            ]
          }
        },
        cta: {
          monthly: '月額プランに登録',
          yearly: '年額プランに登録',
          trial: '新規ユーザー登録で7日間無料試用 • いつでもキャンセル可能'
        }
      },
      finalCta: {
        title: '混乱を明晰に変える準備はできましたか？',
        subtitle: '今すぐDopamindをダウンロードし、AIをあなたの最も理解してくれるパートナーにしましょう。集中的で効率的な新しいライフスタイルを始めましょう。',
        trial: '新規ユーザー登録で7日間無料試用 • いつでもキャンセル可能',
        users: '10,000人以上の満足ユーザーに参加',
        termsAndPrivacy: 'Dopamindを使用することで、当社の{terms}と{privacy}に同意したものとみなされます。',
        termsLink: '利用規約',
        privacyLink: 'プライバシーポリシー',
        termsUrl: '利用規約: https://dopamind.app/terms',
        privacyUrl: 'プライバシーポリシー: https://dopamind.app/privacy',
        stats: [
          { value: '10K+', label: 'アクティブユーザー' },
          { value: '95%', label: 'ユーザー満足度' },
          { value: '4.9', label: 'App Store評価' }
        ]
      }
    },
    terms: {
      title: '利用規約',
      subtitle: 'Dopamindサービスをご利用になる前に、本利用規約をよくお読みください',
      lastUpdated: '最終更新',
      sections: {
        acceptance: {
          title: '利用規約の同意',
          content: 'Dopamindへようこそ！当社のアプリケーションおよびサービスにアクセスまたは利用することで、お客様は本利用規約に拘束されることに同意するものとします。これらの条項に同意されない場合は、当社のサービスをご利用にならないでください。'
        },
        serviceDescription: {
          title: 'サービス説明',
          content: 'DopamindはADHDユーザー向けに設計されたAIコンパニオンアプリで、タスク管理、フォーカスモード、習慣追跡などの機能を提供します。',
          features: {
            title: '提供する主な機能：',
            items: [
              'AI対話式タスク管理',
              'スマートタスク分解と優先順位付け',
              'フォーカスモードとポモドーロテクニック',
              '習慣追跡とデータ可視化',
              'クラウドデータ同期',
              'マルチプラットフォーム対応'
            ]
          }
        },
        userResponsibilities: {
          title: 'ユーザーの責任',
          subtitle: 'サービスご利用時、お客様には以下の責任があります：',
          items: [
            {
              title: 'アカウントセキュリティ',
              description: 'アカウントのパスワードとログイン情報を保護し、他人とアカウントを共有しない責任があります。'
            },
            {
              title: 'コンテンツの正確性',
              description: '提供するすべての情報は真実、正確、完全かつ最新である必要があります。'
            },
            {
              title: '合法的使用',
              description: '適用されるすべての法律と規制に従い、違法な目的でサービスを使用してはいけません。'
            },
            {
              title: '他者への敬意',
              description: 'カスタマーサービスや他のユーザーとやり取りする際は、礼儀正しく敬意を払う必要があります。'
            }
          ]
        },
        prohibitedUses: {
          title: '禁止行為',
          warning: '以下の行為は厳格に禁止されており、違反者はアカウント停止または永久禁止処分を受けます：',
          items: [
            '違法活動へのサービス使用',
            'ソフトウェアのハッキング、逆コンパイル、リバースエンジニアリングの試み',
            'マルウェアやウイルスのアップロード',
            '他のユーザーやスタッフへの嫌がらせ',
            '偽アカウント作成や他人のなりすまし',
            'カスタマーサービスシステムの悪用やスパム送信',
            '知的財産権法の違反',
            'サービスの正常な運営への干渉や妨害'
          ]
        },
        intellectualProperty: {
          title: '知的財産権',
          content: 'Dopamindアプリケーション、そのコンテンツ、機能および特徴（情報、ソフトウェア、テキスト、ディスプレイ、画像、ビデオ、オーディオ、およびそれらのデザイン、選択、配置を含むがこれらに限定されない）は、当社または当社のライセンサーが所有し、著作権、商標、特許およびその他の知的財産法によって保護されています。',
          userContent: 'お客様が作成したタスク、メモ、その他のユーザーコンテンツの所有権はお客様が保持します。当社のサービスを使用することで、サービス提供のためにこれらのコンテンツを処理、保存、同期する権利を当社に付与することになります。'
        },
        paidServices: {
          title: '有料サービスと課金',
          items: [
            {
              title: 'サブスクリプションモデル',
              description: '無料試用と有料サブスクリプションサービスを提供しています。現在の課金サイクル終了前にキャンセルしない限り、サブスクリプションは自動更新されます。'
            },
            {
              title: '価格変更',
              description: 'サブスクリプション価格をいつでも変更する権利を留保しますが、既存ユーザーには少なくとも30日前に通知いたします。'
            },
            {
              title: '返金ポリシー',
              description: 'アプリストアのポリシーに従い、特定の状況下では返金が可能な場合があります。購入プラットフォームの返金規約をご参照ください。'
            },
            {
              title: '無料試用',
              description: '新規ユーザーは7日間の無料試用期間をお楽しみいただけます。試用期間終了後、キャンセルしない場合は自動的に有料サブスクリプションに移行します。'
            }
          ]
        },
        disclaimer: {
          title: '免責事項',
          content: '当社のサービスは「現状のまま」提供され、明示または黙示の保証は一切ありません：',
          items: [
            'サービスの無中断または無エラー運営を保証いたしません',
            'AI提案は参考用であり、専門的な医療または精神的健康アドバイスを構成するものではありません',
            'AI提供の提案はお客様自身の判断に基づいて使用する必要があります',
            'サービスの使用または使用不能により生じるいかなる損失についても責任を負いません',
            '第三者のコンテンツやサービスについては責任を負いません'
          ]
        },
        serviceChanges: {
          title: 'サービス変更と終了',
          content: '当社は予告なしにサービスを変更、停止、終了する権利を留保します。また、定期的なメンテナンスが必要な場合があり、その間サービスが一時的に利用できなくなる可能性があります。',
          terminationConditions: [
            '本利用規約の違反',
            '詐欺または悪用の疑い',
            '長期間非アクティブなアカウント',
            '法的要件または規制命令',
            'サービスが商業的に実行不可能'
          ]
        },
        governingLaw: {
          title: '準拠法',
          content: '本利用規約はシンガポール法に準拠します。紛争が発生した場合、両当事者はまず友好的な交渉による解決に同意し、交渉が失敗した場合は、シンガポール仲裁センターに仲裁を提出するものとします。'
        },
        contact: {
          title: 'お問い合わせ',
          subtitle: '本利用規約についてご質問がある場合は、お問い合わせください：',
          email: 'legal@dopamind.com',
          support: 'support@dopamind.com',
          responseTime: 'お問い合わせから7営業日以内にご回答いたします。'
        }
      }
    },
    paymentSuccess: {
      title: '🎉 お支払い完了！',
      subtitle: 'Dopamind Premiumへようこそ',
      membershipActivated: 'Premiumメンバーシップが有効になりました',
      paymentDetails: '支払い詳細',
      paymentStatus: '支払いステータス：',
      paid: '支払い完了',
      subscriptionId: 'サブスクリプションID：',
      sessionId: '支払いセッション：',
      premiumFeatures: 'お使いいただけるPremium機能',
      features: [
        'AI対話式プランニング - チャットのようにすべてを整理',
        '没入型集中サンクチュアリ - 妨害をブロック、フロー状態に',
        'AIスマート分解 - 複雑なプロジェクトを小さなステップに',
        'マルチデバイスクラウド同期 - すべてのデータ、永続保存',
        'ビジュアル成長レポート - ヒートマップで進歩を見証'
      ],
      startUsing: 'Premium機能を使い始める',
      manageSubscription: 'サブスクリプション管理',
      thankYou: 'Dopamind Premiumをお選びいただき、ありがとうございます！',
      support: 'カスタマーサポート',
      confirmingPayment: '支払いステータスを確認中...',
      missingSessionId: '支払いセッションIDがありません',
      fetchError: '支払い詳細の取得に失敗しましたが、お支払いは正常に処理されました'
    },
    paymentCancelled: {
      title: 'お支払いがキャンセルされました',
      subtitle: '大丈夫です、いつでも再開できます',
      incompletePayment: '支払い未完了',
      whatHappened: '何が起こったのですか？',
      explanation: [
        'お支払いプロセスが中断またはキャンセルされました',
        '料金は請求されていません',
        'アカウントの状態は変更されていません',
        'いつでも購入を再試行できます'
      ],
      whyPremium: 'なぜPremiumを選ぶのか？',
      premiumFeatures: [
        '🧠 AI対話式プランニング - チャットのように生活を整理',
        '🎯 没入型集中モード - 先延ばしとお別れ',
        '📊 ビジュアル成長レポート - 毎日の進歩を見証',
        '☁️ マルチデバイスクラウド同期 - いつでもどこでもアクセス',
        '🎮 スマートゲーミフィケーションシステム - 自制を楽しく'
      ],
      retryPayment: 'サブスクリプションプランを再選択',
      backToHome: 'ホームに戻る',
      contactSupport: 'サポートに連絡',
      tip: '💡 ヒント',
      savings: '年間サブスクリプションで2ヶ月分お得！12%オフ相当！さらに専用メンバーコミュニティアクセス特典付き。'
    },
    accountDeletion: {
      title: 'Dopamind アカウント・データ削除ガイド',
      subtitle: 'Dopamind アカウントと関連するすべてのデータを完全に削除する方法をご案内します',
      appInfo: {
        title: 'アプリ情報',
        appName: 'アプリ名',
        developer: '開発者名',
        contact: '連絡先メール'
      },
      steps: {
        title: 'アカウント削除手順',
        items: [
          {
            number: 1,
            title: 'Dopamind アプリを開いてログイン',
            description: '削除したいアカウントにログインしていることを確認してください'
          },
          {
            number: 2,
            title: '「マイページ」に移動',
            description: 'アプリの下部ナビゲーションバーで「マイページ」をタップします'
          },
          {
            number: 3,
            title: '「アカウント情報」をタップ',
            description: 'プロフィールページで「アカウント情報」を見つけてタップします'
          },
          {
            number: 4,
            title: '「アカウントを完全削除」ボタンをタップ',
            description: 'アカウント情報ページの下部にある赤い「アカウントを完全削除」ボタンをタップします'
          },
          {
            number: 5,
            title: 'パスワードを入力して最終確認',
            description: '画面の指示に従って、アカウントのパスワードを入力し最終確認を行います'
          }
        ]
      },
      dataInfo: {
        title: '重要なデータ情報',
        warning: '注意：アカウント削除は元に戻すことができない操作です！',
        description: '一度確認すると、すべての個人情報とデータが完全に削除され、復旧することはできません。',
        deletedData: {
          title: '以下のデータが完全に削除されます：',
          items: [
            'すべての個人情報（ニックネーム、メール、アバターなど）',
            'すべてのタスク記録と完了履歴',
            'すべての習慣データと追跡記録',
            'すべての集中セッション記録',
            'AI コーチとのチャット履歴',
            'アプリの設定とカスタム構成',
            'サブスクリプションと支払い記録',
            'アカウントに関連するその他すべてのデータ'
          ]
        }
      },
      confirmation: {
        title: '確認要件',
        description: 'アカウントセキュリティを確保するため、削除操作には以下の条件が必要です：',
        requirements: [
          '現在のアカウントのログインパスワードを入力',
          'この操作の不可逆性を理解していることを確認',
          'すべてのデータ復旧権利を放棄することに同意'
        ]
      },
      support: {
        title: 'ヘルプが必要ですか？',
        description: '削除プロセス中に問題が発生した場合、またはご質問がある場合は、サポートチームにお問い合わせください：',
        subject: 'メールの件名',
        subjectText: 'アカウント削除に関する問題',
        responseTime: '24-48時間以内にメールに返信いたします'
      },
      alternatives: {
        title: '削除前のその他の選択肢',
        description: 'アカウントを完全削除する前に、以下の代替案もご検討ください：',
        options: [
          {
            title: '使用一時停止',
            description: 'アプリを削除してもアカウントは保持し、いつでも再インストールしてデータを復旧できます'
          },
          {
            title: 'データエクスポート',
            description: 'サポートチームに連絡して個人データのバックアップをエクスポートできます'
          },
          {
            title: 'サブスクリプション解約',
            description: '支払いを停止したい場合は、アカウントを削除せずにサブスクリプションのみ解約できます'
          },
          {
            title: 'サポートに連絡',
            description: '問題が発生した場合、私たちのチームが喜んでお手伝いします'
          }
        ]
      }
    }
  }
};

export function getTranslation(locale: string) {
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : defaultLocale;
  return translations[validLocale];
}