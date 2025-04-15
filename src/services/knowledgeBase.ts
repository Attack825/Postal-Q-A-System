export interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
}

// 示例知识库数据
const knowledgeBase: KnowledgeItem[] = [
  {
    id: '1',
    title: '物流运输方式',
    content:
      '物流运输方式主要包括：公路运输、铁路运输、水路运输、航空运输和管道运输。每种运输方式都有其特点和适用场景。',
    category: '基础概念',
    tags: ['运输方式', '基础'],
  },
  {
    id: '2',
    title: '物流成本构成',
    content:
      '物流成本主要包括：运输成本、仓储成本、包装成本、装卸搬运成本、流通加工成本、物流信息成本和管理成本。',
    category: '成本管理',
    tags: ['成本', '管理'],
  },
  {
    id: '3',
    title: '物流配送流程',
    content:
      '标准物流配送流程包括：订单处理、拣货、包装、装车、运输、配送、签收等环节。每个环节都需要严格的质量控制。',
    category: '操作流程',
    tags: ['流程', '配送'],
  },
]

export class KnowledgeBaseService {
  /**
   * 根据问题检索相关知识
   * @param question 用户问题
   * @returns 相关知识点列表
   */
  async searchKnowledge(question: string): Promise<KnowledgeItem[]> {
    // TODO:这里可以接入实际的搜索引擎或向量数据库
    // 目前使用简单的关键词匹配作为示例
    const keywords = question.toLowerCase().split(' ')

    return knowledgeBase.filter((item) => {
      const content = (item.title + ' ' + item.content + ' ' + item.tags.join(' ')).toLowerCase()
      return keywords.some((keyword) => content.includes(keyword))
    })
  }

  /**
   * 将知识库内容格式化为提示词
   * @param knowledgeItems 知识点列表
   * @returns 格式化后的提示词
   */
  formatKnowledgeAsPrompt(knowledgeItems: KnowledgeItem[]): string {
    if (knowledgeItems.length === 0) return ''

    let prompt = '根据以下物流知识回答问题：\n\n'
    knowledgeItems.forEach((item) => {
      prompt += `标题：${item.title}\n`
      prompt += `内容：${item.content}\n\n`
    })
    return prompt
  }
}

export const knowledgeBaseService = new KnowledgeBaseService()
