---
name: 'LoL Match Prediction'
summary: '基于早期对局数据的英雄联盟胜负预测：使用 6 种机器学习模型分析 9,879 场钻石段位比赛，以 72% 准确率预测 10 分钟后胜负走向。'
stack: ['Python', 'scikit-learn', 'Pandas', 'Logistic Regression', 'Random Forest', 'Gradient Boosting', 'SVM', 'Matplotlib', 'Seaborn']
url: 'https://astro-wen.github.io/UCLA_C111_LoL/'
repo: 'https://github.com/Astro-wen/UCLA_C111_LoL'
order: 0
featured: true
---

## 概览

这是我在 UCLA AOS C111（Introduction to Machine Learning for Physical Sciences）课程中完成的期末项目（December 2025）。项目以 Kaggle 上的「英雄联盟钻石段位排位赛前 10 分钟数据」为基础，训练并评估 6 种分类模型来预测比赛胜负。

## 关键数字

| 指标 | 数值 |
|------|------|
| 数据集规模 | 9,879 场钻石段位比赛 |
| 最佳准确率 | ~72%（Logistic Regression L1） |
| 特征数量 | 14 个精选特征 |
| 模型数量 | 6 种（Logistic L1/L2 + Decision Tree + Random Forest + Gradient Boosting + SVM） |
| AUC | 0.806（最高） |

## 核心发现

**1. 金币差是胜负的最强预测因子**

金币差异与胜率呈现极其强烈的线性关系——金币最低的 20% 队伍胜率仅 13.6%，最高 20% 队伍胜率高达 87.0%，差距达 73.4 个百分点。

![Win Rate by Gold Lead](/media/lol-report/figure1_win_rate_by_gold.png)

**2. 所有模型性能趋同 ~72%，线性模型最优**

从简单 Logistic Regression 到复杂 SVM（RBF 核），测试集准确率均在 71.7%–72.4% 之间。这表明前 10 分钟数据能解释的胜率上限约为 72%——剩下 28% 取决于英雄阵容、个人操作和中后期决策。

![Model Performance Comparison](/media/lol-report/figure4_model_comparison.png)

**3. 关键战略洞见**

| 因素 | 胜率提升 |
|------|----------|
| 获得一血（First Blood） | +20.2 pp |
| 控龙（Dragon） | +22.2 pp |
| 控峡谷先锋（Herald） | +11.8 pp |
| 同时控龙 + 先锋 | +33.7 pp |
| 击杀领先 3+ | +65.1 pp |

## 特征重要性

Logistic Regression 系数和 Random Forest 重要性评分一致表明：**金币差 > 经验差 > KD 比 > 击杀数 > 一血**。

![Feature Importance](/media/lol-report/figure6_feature_importance.png)

## ROC 曲线

所有模型 AUC 均在 0.78–0.81 之间，Logistic Regression（L1/L2）达到 0.806，显著优于随机分类器。

![ROC Curves](/media/lol-report/figure5_roc_curves.png)

## 相关链接

- 📊 [完整报告（中文）](/Astro/blog/ucla-c111-lol-prediction-zh) — 含全部代码、图表与分析
- 📊 [Full Report (English)](/Astro/blog/ucla-c111-lol-prediction-en) — Complete report with code and figures
- 🌐 [项目官网](https://astro-wen.github.io/UCLA_C111_LoL/) — 在线报告
- 💻 [GitHub 仓库](https://github.com/Astro-wen/UCLA_C111_LoL) — 源代码
- 📦 [Kaggle 数据集](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min)
