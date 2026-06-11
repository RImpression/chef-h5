/** 技巧文章索引项 */
export interface TipArticleMeta {
  id: string;
  title: string;
  group: string;
  summary: string;
}

/** 技巧分组 */
export interface TipGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: TipArticleMeta[];
}

/** 文章段落（按 ## 拆分） */
export interface TipSection {
  title: string;
  content: string;
}

/** 技巧文章完整数据 */
export interface TipArticle extends TipArticleMeta {
  content: string;
  sections: TipSection[];
}
