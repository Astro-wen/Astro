---
title: '用机器学习预测英雄联盟比赛胜负：从 10 分钟数据到 72% 准确率'
date: 2025-12-15
summary: '基于 9,879 场钻石段位比赛的前 10 分钟数据，训练 6 种分类模型预测英雄联盟胜负。完整技术报告，含全部代码、图表与分析。'
tags: ['machine-learning', 'lol', 'python', 'ucla', 'data-science']
cover: '/media/lol-report/figure4_model_comparison.png'
draft: false
---

> **语言**: 这是完整报告的中文版。[English Version →](/Astro/blog/ucla-c111-lol-prediction-en)
>
> **相关链接**: [项目官网](https://astro-wen.github.io/UCLA_C111_LoL/) · [GitHub 仓库](https://github.com/Astro-wen/UCLA_C111_LoL) · [Kaggle 数据集](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min) · [Colab 代码](https://colab.research.google.com/drive/1M3lTclYuREo6cQWqkfEM9ozNS7ymSdts?usp=sharing)

---

## 这个项目背后的故事

故事得从 2017 年 10 月说起。

那时候我还是一个六年级的孩子，第一次接触到英雄联盟电竞比赛。我成了 [RNG（Royal Never Give Up）](https://lol.fandom.com/wiki/Royal_Never_Give_Up) 的铁杆粉丝——至今我仍然记得看他们在比赛开局布置伏击、打对手一个措手不及、在几分钟内拿下一血时那种血脉偾张的感觉。

但即使作为一个孩子，我也不禁想：那一次击杀到底有多重要？如果我方在前 10 分钟领先 2000 金币，这对最终胜率究竟意味着什么？

八年过去了。我从观众变成了玩家，但那些问题从未离开我。每一场比赛中，我都会思考：在前期对局里，什么才是真正重要的？什么才能带来胜利？

快进到大学时代，在 UCLA 的 AOS C111 课程上，我终于有机会系统地学习机器学习——特别是特征工程和预测建模。我意识到：这些工具能否回答我从童年就带着的那些问题？

然后我在 Kaggle 上找到了这个数据集——最疯狂的部分是：它创建的时间，大约正是我第一次接触英雄联盟的时候。

仿佛是命运给了我一个暗示。

于是就有了这个项目：**一个八年磨一剑的机器学习项目，旨在回答一个好奇的六年级学生想要理解他所热爱游戏的那些问题。**

---

## 摘要

本项目运用监督学习方法，仅凭比赛前 10 分钟的对局数据预测英雄联盟的最终胜负。数据集涵盖 9,879 场钻石段位排位赛，我在此基础上训练并评估了六种分类模型：逻辑回归（Logistic Regression，分别采用 L1 与 L2 正则化）、决策树（Decision Tree）、随机森林（Random Forest）、梯度提升（Gradient Boosting）及支持向量机（SVM）。六种模型的测试集准确率均在 72% 左右，其中 L1 逻辑回归在五折交叉验证中表现最优（73.5% ± 1.5%），AUC 达到 0.80。特征重要性分析显示，金币差（Gold Difference）是最强预测因子（r = 0.51），经验差（Experience Difference）紧随其后（r = 0.49）。进一步量化分析表明：拿到一血可将胜率提升约 20 个百分点，同时拿下小龙与峡谷先锋的队伍胜率高达 73%。这些发现为玩家的前期策略优化提供了扎实的数据支撑。

---

## 1. 引言

### 英雄联盟

英雄联盟（League of Legends，简称 LoL）是一款经典的 5v5 MOBA 竞技游戏，双方各五名玩家分别操控英雄，目标是率先摧毁对方基地中的水晶枢纽（Nexus）。一场比赛通常持续 25–40 分钟，大致可划分为前期（0–15 分钟）、中期（15–25 分钟）和后期（25 分钟以上）三个阶段。其中，前期——也就是俗称的"对线期"——历来被认为是奠定胜局的关键窗口。

对线期的核心任务包括：通过补刀（击杀小兵）积累金币、击杀敌方英雄获取人头赏金，以及争夺中立资源——小龙（Dragon，为全队提供永久 buff）和峡谷先锋（Rift Herald，可召唤冲撞敌方防御塔）。在这短短几分钟里，是激进抢人头、稳健补刀发育，还是转线支援队友，每一个决策都可能深刻影响比赛走向。

在职业赛场上，教练和数据分析师围绕"前期什么最重要"这个问题争论已久：有人认为一血（First Blood，比赛中的第一次击杀，额外奖励金币）能带来决定性的节奏优势；也有人强调稳定的 CS（Creep Score，即补刀数）才是保障经济收入的根本。本项目的目标，正是用机器学习的方式给出一个量化的回答。

具体而言，本研究有三个目标：其一，仅用前 10 分钟的比赛数据构建分类模型来预测最终胜负；其二，借助特征重要性分析，识别哪些前期因素对胜负的影响最为显著；其三，将模型结论转化为可落地的前期战略建议。基于近万场高水平排位赛的训练数据，本分析力图超越"经验之谈"，为玩家提供真正有数据支撑的决策参考。

---

## 2. 数据

### 2.1 数据集概览

本项目所用数据集来自 Kaggle，收录了 9,879 场钻石段位排位赛在第 10 分钟时的全量统计数据。钻石段位大致对应全服前 2% 的玩家群体，处于"认真打排位的高分玩家"和"职业/半职业选手"之间的分水岭——选择这一段位能够确保数据反映的是具有竞技性的高水平对局，而非低分段中因基本操作失误而掩盖战略规律的比赛。10 分钟这个时间节点同样经过考量：此时对线期已经充分展开，但大部分团队性目标（如第二条小龙、男爵）尚未开放，恰好能捕捉到前期博弈的核心信息。

**数据来源:** [Kaggle - League of Legends Diamond Ranked Games 10 min](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min)

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, confusion_matrix, classification_report,
                             roc_curve, auc)

np.random.seed(42)
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 11

df = pd.read_csv('high_diamond_ranked_10min.csv')
print(f"Dataset Shape: {df.shape[0]} games × {df.shape[1]} features")

print(f"\nMissing Values: {df.isnull().sum().sum()}")

blue_cols = [col for col in df.columns if col.startswith('blue')]
red_cols = [col for col in df.columns if col.startswith('red')]
print(f"\nBlue team features: {len(blue_cols)}")
print(f"Red team features: {len(red_cols)}")
```

运行结果：

```
Dataset Shape: 9879 games × 40 features
Missing Values: 0
Blue team features: 20
Red team features: 19
```

数据集包含 9,879 场比赛，40 个特征，零缺失值。蓝色方 20 个特征，红色方 19 个特征。

### 2.2 特征描述

数据集共 40 列，由一个游戏 ID、一个目标变量和两队各 19 个特征组成。

**目标变量**是 `blueWins`，二元指标：1 代表蓝队获胜，0 代表红队获胜。

特征按游戏机制分为以下几类：

- **战斗统计**：`blueKills`（击杀）、`blueDeaths`（死亡）、`blueAssists`（助攻）——直接反映 PvP 战斗表现。在英雄联盟中，每次击杀约奖励 300 金币，加上基于连杀的额外金币。
- **经济指标**：`blueTotalGold`（总金币）、`blueGoldDiff`（金币差）、`blueTotalExperience`（总经验）、`blueExperienceDiff`（经验差）——等级高意味着更强的技能和基础属性，创造滚雪球优势。
- **发育统计**：`blueTotalMinionsKilled`（补刀数 / CS）、`blueTotalJungleMinionsKilled`（打野怪数）——职业选手通常目标是每分钟 8-10 CS，即 10 分钟时约 80-100 个小兵。
- **目标控制**：`blueDragons`（小龙数）、`blueHeralds`（先锋数）、`blueTowersDestroyed`（推塔数）、`blueFirstBlood`（一血）
- **视野控制**：`blueWardsPlaced`（插眼数）、`blueWardsDestroyed`（排眼数）

```python
win_counts = df['blueWins'].value_counts()
print("Target Variable Distribution:")
print(f"  Blue Team Wins: {win_counts[1]:,} ({win_counts[1]/len(df):.1%})")
print(f"  Red Team Wins:  {win_counts[0]:,} ({win_counts[0]/len(df):.1%})")
```

运行结果：

```
Target Variable Distribution:
  Blue Team Wins: 4,930 (49.9%)
  Red Team Wins:  4,949 (50.1%)
```

![整体胜率分布](/media/lol-report/Overall%20Win%20Distribution.png)

目标变量分布近乎完美平衡——蓝队胜率 49.9%，红队 50.1%。这对二分类任务而言是理想状态：我们可以直接采用准确率（Accuracy）作为核心评价指标，无需额外处理类别不均衡问题。

### 2.3 探索性数据分析

在正式建模之前，有必要先摸清前期各项数据与最终胜负之间的关联——这将为后续的特征选择和模型设计提供方向。

```python
fig, ax = plt.subplots(figsize=(10, 5))

df['goldQuintile'] = pd.qcut(df['blueGoldDiff'], q=5, 
                             labels=['Q1 (Lowest)', 'Q2', 'Q3', 'Q4', 'Q5 (Highest)'])
win_rate_by_gold = df.groupby('goldQuintile', observed=True)['blueWins'].mean()

colors_gradient = ['#c0392b', '#e74c3c', '#f39c12', '#27ae60', '#1e8449']
bars = ax.bar(range(len(win_rate_by_gold)), win_rate_by_gold.values, 
              color=colors_gradient, edgecolor='black')

ax.set_xlabel('Gold Difference Quintile at 10 min', fontweight='bold')
ax.set_ylabel('Win Rate', fontweight='bold')
ax.set_title('Win Rate by Early Gold Lead', fontweight='bold', fontsize=14)
ax.set_xticks(range(len(win_rate_by_gold)))
ax.set_xticklabels(win_rate_by_gold.index, fontsize=10)
ax.axhline(y=0.5, color='gray', linestyle='--', alpha=0.7, label='50% Win Rate')
ax.set_ylim([0, 1])
ax.legend()

for bar, value in zip(bars, win_rate_by_gold.values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{value:.1%}', ha='center', fontweight='bold', fontsize=11)

plt.tight_layout()
plt.savefig('figure1_win_rate_by_gold.png', dpi=150, bbox_inches='tight')
plt.show()

df.drop('goldQuintile', axis=1, inplace=True)
```

![按金币领先分位数的胜率](/media/lol-report/figure1_win_rate_by_gold.png)

上图呈现了金币优势与胜率之间极为显著的关系。10 分钟时经济处于最低 20% 的队伍，胜率仅 **13.6%**；而处于最高 20% 的队伍胜率则高达 **87.0%**——两者相差 73.4 个百分点。这一差距极其悬殊，说明前期经济优势几乎是最强的胜负风向标。

用一个实际的游戏场景来理解：假设一支队伍在前期拿到两个人头（约 600 金币），同时保持 10 个 CS 的补刀领先（约 200 金币），合计 800 金币的优势就足以把他们从中位数区间推到第四个五分位，预期胜率从约 49% 跃升至 67%。英雄联盟中的"滚雪球"效应——有钱买装备，装备强了更容易赚钱——完美解释了为什么前期哪怕不大的领先也会被指数级放大。

```python
fig, ax = plt.subplots(figsize=(10, 7))
feature_cols = ['blueGoldDiff', 'blueExperienceDiff', 'blueKills', 'blueDragons', 
                'blueFirstBlood', 'blueTowersDestroyed', 'blueHeralds', 
                'blueAssists', 'blueTotalMinionsKilled', 'blueDeaths']

correlations = df[feature_cols].corrwith(df['blueWins']).sort_values(ascending=True)

colors_corr = ['#E74C3C' if x < 0 else '#27AE60' for x in correlations.values]
bars = ax.barh(range(len(correlations)), correlations.values, color=colors_corr, alpha=0.8)

ax.set_yticks(range(len(correlations)))
ax.set_yticklabels([col.replace('blue', '').replace('Diff', ' Difference') 
                    for col in correlations.index], fontsize=10)
ax.set_xlabel('Correlation Coefficient (r)', fontweight='bold')
ax.set_title('Feature Correlations with Victory', fontweight='bold', fontsize=12)
ax.axvline(x=0, color='black', linestyle='-', alpha=0.3)
ax.set_xlim([-0.6, 0.6])
ax.grid(axis='x', alpha=0.3)

plt.tight_layout()
plt.savefig('figure2_feature_correlations.png', dpi=150, bbox_inches='tight')
plt.show()
```

![各特征与胜率的相关性](/media/lol-report/figure2_feature_correlations.png)

金币差以 0.511 的皮尔逊相关系数位居所有特征之首，经验差以 0.490 紧随其后。值得注意的是，击杀数的相关性（0.338）远低于金币差——这揭示了一条重要的战略逻辑：**人头的价值本质上在于它带来的经济和经验收益，而非击杀行为本身**。一支队伍如果频繁拿到人头、却未能将其转化为实际的资源优势，那么这些击杀的边际收益可能远低于预期。

死亡的负相关为 -0.339，与击杀几乎呈镜像对称。换句话说——**少死一次的价值，与多杀一次几乎等价**。这也印证了高分段的常见共识：在局势不利时，"不送"比"强杀"更优先。

![特征相关性热力图](/media/lol-report/figure2b_correlation_heatmap.png)

热力图揭示了几个关键模式：

1. **金币差与经验差高度相关**（r = 0.89）——领先的队伍通常在两个维度都占优
2. **击杀与助攻强相关**（r = 0.81）——团战同时产生两种数据
3. **补刀数与死亡负相关**（r = -0.47）——频繁死亡的玩家也错过发育机会，形成双重惩罚
4. **一血与其他战斗统计弱相关**——说明它捕捉了独特的前期信息

---

## 3. 方法

### 3.1 特征工程

在原始特征基础上，本研究创建了几个衍生特征来捕捉更高层次的游戏状态。

```python
df_model = df.copy()

# KD Ratio
df_model['blueKDRatio'] = df_model['blueKills'] / (df_model['blueDeaths'] + 1)

# Objective Control
df_model['blueObjectiveControl'] = df_model['blueDragons'] + df_model['blueHeralds']

# CS Difference
df_model['blueCSDiff'] = df_model['blueTotalMinionsKilled'] - df_model['redTotalMinionsKilled']

print("Engineered Features Created:")
print("  - blueKDRatio")
print("  - blueObjectiveControl")
print("  - blueCSDiff")
```

- **KD 比**（Kill-to-Death Ratio）：击杀数 / (死亡数 + 1)，捕捉战斗效率——KD 比 1.67 说明赢得了战斗，0.56 说明即使有击杀也在亏损
- **目标控制分**：小龙 + 先锋数，反映地图控制力和团队协作能力
- **CS 差**：双方补刀差异，专门衡量对线表现。每个小兵约值 20 金币，20 CS 优势约等于 400 金币

### 3.2 特征选择

从所有可用特征中，我选择了 14 个用于最终模型：

```python
selected_features = [
    # Combat statistics
    'blueKills', 'blueDeaths', 'blueAssists',
    # Economic differences
    'blueGoldDiff', 'blueExperienceDiff',
    # Objective control
    'blueDragons', 'blueHeralds', 'blueFirstBlood', 'blueTowersDestroyed',
    # Engineered features
    'blueKDRatio', 'blueObjectiveControl', 'blueCSDiff',
    # Farming statistics
    'blueTotalMinionsKilled', 'blueTotalJungleMinionsKilled',
]

X = df_model[selected_features].copy()
y = df_model['blueWins'].copy()

print(f"Feature Matrix: {X.shape[0]} samples × {X.shape[1]} features")
```

运行结果：

```
Feature Matrix: 9879 samples × 14 features
```

选择这 14 个特征基于以下原则：避免高度相关特征间的冗余、确保每个特征有清晰的战略含义、同时包含原始统计和工程特征。

被排除的特征包括：`TotalGold`（被 `GoldDiff` 更好地替代）、`WardsPlaced/Destroyed`（与胜率的相关性极低）、`AvgLevel`（与 `ExperienceDiff` 高度相关）、`GoldPerMin` 和 `CSPerMin`（在固定 10 分钟时间点下是确定性函数）。

### 3.3 数据预处理

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training Set: {X_train.shape[0]} samples (Win Rate: {y_train.mean():.2%})")
print(f"Test Set:     {X_test.shape[0]} samples (Win Rate: {y_test.mean():.2%})")

scaler = StandardScaler()
X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=selected_features)
X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=selected_features)
```

运行结果：

```
Training Set: 7903 samples (Win Rate: 49.91%)
Test Set:     1976 samples (Win Rate: 49.90%)
```

使用分层抽样（stratification）确保训练集和测试集保持约 50% 的胜率。特征标准化将每个特征转换为零均值和单位方差，这对 Logistic Regression 和 SVM 至关重要——例如金币差范围可能是 -10,000 到 +10,000，而一血始终是 0 或 1，不标准化会让大量级特征主导优化过程。

### 3.4 模型

我实现了六种分类模型，代表不同的机器学习范式。

#### 3.4.1 Logistic Regression（L2 正则化）

Logistic Regression 用 sigmoid 函数建模正类的概率：

$$P(y=1|x) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + ... + \beta_n x_n)}}$$

L2 正则化惩罚大系数值，鼓励模型找到不被单个特征主导的解。

```python
log_reg = LogisticRegression(penalty='l2', C=1.0, solver='lbfgs', max_iter=1000, random_state=42)
log_reg.fit(X_train_scaled, y_train)
results['Logistic Regression'] = evaluate_model(log_reg, X_train_scaled, X_test_scaled, y_train, y_test)

print("Logistic Regression (L2):")
print(f"  Train Accuracy: {results['Logistic Regression']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['Logistic Regression']['test_acc']:.4f}")
```

运行结果：

```
Logistic Regression (L2):
  Train Accuracy: 0.7359
  Test Accuracy:  0.7242
```

#### 3.4.2 Logistic Regression（L1 / Lasso 正则化）

L1 正则化会将某些系数驱动到恰好为零，相当于自动执行特征选择。

```python
log_reg_l1 = LogisticRegression(penalty='l1', C=1.0, solver='saga', max_iter=1000, random_state=42)
log_reg_l1.fit(X_train_scaled, y_train)
results['Logistic Regression (L1)'] = evaluate_model(log_reg_l1, X_train_scaled, X_test_scaled, y_train, y_test)

print("Logistic Regression (L1):")
print(f"  Train Accuracy: {results['Logistic Regression (L1)']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['Logistic Regression (L1)']['test_acc']:.4f}")

l1_coefs = pd.Series(log_reg_l1.coef_[0], index=selected_features)
n_selected = (l1_coefs != 0).sum()
print(f"  Features selected: {n_selected}/{len(selected_features)}")
```

运行结果：

```
Logistic Regression (L1):
  Train Accuracy: 0.7362
  Test Accuracy:  0.7242
  Features selected: 13/14
```

L1 模型自动保留了 13 个特征（14 个中剔除 1 个），说明几乎所有特征都贡献了预测信息。

#### 3.4.3 Decision Tree（决策树）

决策树通过递归分割特征空间来学习一系列 if-then 规则。使用 GINI 不纯度作为分裂准则：

$$\text{GINI} = 1 - \sum_{i=1}^{C} p_i^2$$

GINI 值为 0 表示纯净节点（全属一类），0.5 表示二分类中的最大不确定性。

```python
decision_tree = DecisionTreeClassifier(
    criterion='gini', max_depth=5, min_samples_split=50, min_samples_leaf=20, random_state=42
)
decision_tree.fit(X_train, y_train)
results['Decision Tree'] = evaluate_model(decision_tree, X_train, X_test, y_train, y_test)

print("Decision Tree:")
print(f"  Train Accuracy: {results['Decision Tree']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['Decision Tree']['test_acc']:.4f}")
```

运行结果：

```
Decision Tree:
  Train Accuracy: 0.7378
  Test Accuracy:  0.7196
```

超参数的选择旨在防止过拟合：最大深度 5、最小分裂样本 50、最小叶节点样本 20。

#### 3.4.4 Random Forest（随机森林）

随机森林构建多棵决策树并通过多数投票合并预测。每棵树在随机数据子集上训练，并在每次分裂时只考虑随机特征子集，这种随机性减少了单棵树的过拟合。

```python
random_forest = RandomForestClassifier(
    n_estimators=100, criterion='gini', max_depth=10, 
    min_samples_split=20, min_samples_leaf=10, random_state=42, n_jobs=-1
)
random_forest.fit(X_train, y_train)
results['Random Forest'] = evaluate_model(random_forest, X_train, X_test, y_train, y_test)

print("Random Forest:")
print(f"  Train Accuracy: {results['Random Forest']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['Random Forest']['test_acc']:.4f}")
```

运行结果：

```
Random Forest:
  Train Accuracy: 0.7884
  Test Accuracy:  0.7201
```

#### 3.4.5 Gradient Boosting（梯度提升）

梯度提升按顺序构建决策树集成，每棵新树尝试纠正前面树的错误，使用梯度下降方法最小化损失函数。

```python
gradient_boosting = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42
)
gradient_boosting.fit(X_train, y_train)
results['Gradient Boosting'] = evaluate_model(gradient_boosting, X_train, X_test, y_train, y_test)

print("Gradient Boosting:")
print(f"  Train Accuracy: {results['Gradient Boosting']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['Gradient Boosting']['test_acc']:.4f}")
```

运行结果：

```
Gradient Boosting:
  Train Accuracy: 0.7495
  Test Accuracy:  0.7176
```

#### 3.4.6 SVM（支持向量机，RBF 核）

SVM 寻找以最大间隔分隔两类的最优边界。RBF 核将数据变换到更高维空间：

$$K(x, x') = \exp\left(-\gamma ||x - x'||^2\right)$$

```python
svm_model = SVC(kernel='rbf', C=1.0, gamma='scale', probability=True, random_state=42)
svm_model.fit(X_train_scaled, y_train)
results['SVM (RBF)'] = evaluate_model(svm_model, X_train_scaled, X_test_scaled, y_train, y_test)

print("SVM (RBF Kernel):")
print(f"  Train Accuracy: {results['SVM (RBF)']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['SVM (RBF)']['test_acc']:.4f}")
```

运行结果：

```
SVM (RBF Kernel):
  Train Accuracy: 0.7420
  Test Accuracy:  0.7176
```

### 3.5 交叉验证

使用 5 折分层交叉验证获取稳健的性能估计。

```python
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

models_cv = {
    'Logistic Regression': (LogisticRegression(penalty='l2', C=1.0, solver='lbfgs', max_iter=1000, random_state=42), True),
    'Logistic Reg (L1)': (LogisticRegression(penalty='l1', C=1.0, solver='saga', max_iter=1000, random_state=42), True),
    'Decision Tree': (DecisionTreeClassifier(criterion='gini', max_depth=5, min_samples_split=50, random_state=42), False),
    'Random Forest': (RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=20, random_state=42, n_jobs=-1), False),
    'Gradient Boosting': (GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42), False),
    'SVM (RBF)': (SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42), True)
}

cv_results = {}
print("Cross-Validation Results (5-Fold):")

for name, (model, needs_scaling) in models_cv.items():
    X_cv = X_train_scaled if needs_scaling else X_train
    scores = cross_val_score(model, X_cv, y_train, cv=cv, scoring='accuracy', n_jobs=-1)
    cv_results[name] = {'mean': scores.mean(), 'std': scores.std()}
    print(f"  {name:22s}: {scores.mean():.4f} ± {scores.std():.4f}")
```

运行结果：

```
Cross-Validation Results (5-Fold):
  Logistic Regression   : 0.7341 ± 0.0156
  Logistic Reg (L1)     : 0.7347 ± 0.0152
  Decision Tree         : 0.7131 ± 0.0082
  Random Forest         : 0.7291 ± 0.0131
  Gradient Boosting     : 0.7326 ± 0.0120
  SVM (RBF)             : 0.7269 ± 0.0117
```

L1 Logistic Regression 表现最佳，平均 73.5%，标准差仅 1.5%——泛化性能稳定可靠。

### 3.6 超参数调优

![超参数调优实验](/media/lol-report/figure3_hyperparameter_tuning.png)

实验揭示了重要的模型行为：

- **Random Forest**：增加树的数量超过 50 棵后收益递减，测试准确率趋于平稳
- **Gradient Boosting**：呈现经典过拟合模式——`max_depth=2` 时训练和测试准确率相似（~72-74%），`max_depth=10` 时训练准确率达 99% 但测试准确率反而下降。最优深度约为 3，体现了偏差-方差的权衡

---

## 4. 结果

### 4.1 模型性能对比

| 模型 | 训练准确率 | 测试准确率 | 精确度 | 召回率 | F1 |
|------|-----------|----------|--------|--------|------|
| Logistic Regression (L2) | 0.7359 | 0.7242 | 0.7198 | 0.7323 | 0.7260 |
| Logistic Regression (L1) | 0.7362 | 0.7242 | 0.7190 | 0.7343 | 0.7265 |
| Decision Tree | 0.7378 | 0.7196 | 0.7333 | 0.6886 | 0.7103 |
| Random Forest | 0.7884 | 0.7201 | 0.7194 | 0.7201 | 0.7197 |
| Gradient Boosting | 0.7495 | 0.7176 | 0.7179 | 0.7150 | 0.7165 |
| SVM (RBF) | 0.7420 | 0.7176 | 0.7206 | 0.7089 | 0.7147 |

![模型性能对比](/media/lol-report/figure4_model_comparison.png)

六种模型在测试集上的准确率均落在 ~72% 附近——无论是最简单的线性模型还是最复杂的核方法和集成方法，结果高度一致。这一现象本身就是一条重要结论：**前 10 分钟的数据所能解释的胜负上限大约就是 72%**；剩余 28% 的不确定性来自英雄阵容搭配、个人微操发挥以及中后期团战决策等本数据集无法覆盖的信息。

从过拟合角度看，逻辑回归的训练-测试差距仅 1.2%，泛化能力最为优异；随机森林的差距则达 6.8%，说明其在训练集上学到了部分不可推广的噪声模式。

### 4.2 ROC 曲线与 AUC 分析

![ROC 曲线](/media/lol-report/figure5_roc_curves.png)

| 模型 | AUC |
|------|-----|
| Logistic Regression (L2) | 0.8064 |
| Logistic Regression (L1) | 0.8065 |
| Decision Tree | 0.7953 |
| Random Forest | 0.8062 |
| Gradient Boosting | 0.8065 |
| SVM (RBF) | 0.7841 |

所有模型 AUC 在 0.78-0.81 之间，Logistic Regression 达到 0.806——当给定一场胜局和一场败局时，模型正确排序的概率约 80%。

### 4.3 特征重要性分析

![特征重要性](/media/lol-report/figure6_feature_importance.png)

两种方法的结论一致：

- **金币差**在两种方法中都是主导预测因子（Logistic 系数 > 1.0，RF 重要性 0.27）
- **经验差**排名第二
- **KD 比**在 Random Forest 中排第三（~0.16），但在 Logistic Regression 中系数较小——暗示其预测力来自与其他特征的交互
- 有趣的是，控制了金币差和经验差后，原始击杀数和 CS 差的系数反而为负——不能转化为资源优势的击杀/补刀可能反映了低效率的打法

### 4.4 混淆矩阵

![混淆矩阵](/media/lol-report/figure5_confusion_matrix.png)

模型正确预测了 713 场红队胜（36.1%）和 710 场蓝队胜（35.9%），总准确率 72%。误判几乎完全对称（14.0% vs 14.0%），表明模型不偏向任何一方。

---

## 5. 讨论

### 5.1 战略洞见

#### 金币五分位分析

- 金币最低 20%：**13.6%** 胜率
- 金币最高 20%：**87.0%** 胜率
- 差距：**73.4 个百分点**

#### 一血影响

- 未拿一血：**39.7%** 胜率
- 拿到一血：**59.9%** 胜率
- 优势：**+20.2 个百分点**

一血奖励 400 金币（比普通击杀多 100），加上经验优势和心理冲击。拥有强力 1-2 级作战能力的阵容（如 Leona 辅助或 Lee Sin 打野）应积极寻找一血机会。

#### 控龙

- 未控龙：**41.9%** 胜率
- 控龙 1 条：**64.1%** 胜率
- 优势：**+22.2 个百分点**

#### 控先锋

- 未控先锋：**47.7%** 胜率
- 控先锋：**59.5%** 胜率
- 优势：**+11.8 个百分点**

#### 双目标控制

- 未控龙也未控先锋：**39.9%** 胜率
- 同时控龙 + 先锋：**73.5%** 胜率
- 优势：**+33.7 个百分点**

#### 击杀差距

- 落后 3 个以上人头：**18.8%** 胜率
- 领先 3 个以上人头：**83.9%** 胜率
- 波动：**65.1 个百分点**

### 5.2 推荐前期策略

1. **优先保证稳定发育**——目标每分钟 7-8 CS，金币收入是一切优势的基础
2. **积极争取一血**——+20pp 的胜率提升非常可观
3. **龙优先于先锋**——22% vs 12% 的影响差距明显
4. **最小化无谓死亡**——-0.34 的负相关表明死亡几乎和击杀一样重要
5. **落后时果断调整**——被动等待只会导致约 14% 的胜率，需要冒险争取翻盘

### 5.3 模型局限性：为什么准确率止步于 ~72%

- **比赛远未在第 10 分钟定局**——一场 30 分钟的比赛，前 10 分钟只占三分之一，后续的团战决策、资源调度仍有大量变数
- **缺少英雄阵容信息**——部分后期型阵容（如凯尔、卡萨丁）本就计划牺牲前期换取后期碾压
- **同段位内个人实力仍有差异**——一个手感爆炸的玩家可以凭借超常操作逆转局势
- **不可控因素**——掉线（AFK）、网络波动等突发状况无法从统计数据中预见

72% 的准确率应被正面看待：它证明前期表现确实能解释相当大一部分比赛走向，足以为战略优化提供可靠依据。至于剩下的 28%——那正是英雄联盟作为竞技游戏令人着迷之处：变数永远存在，翻盘永远可能。

### 5.4 模型选择讨论

尽管我测试了包含 100 棵树的随机森林和使用 RBF 核的支持向量机等"重型"模型，最简单的逻辑回归在性能上毫不逊色。这意味着前期数据与胜负之间的关系**本质上接近线性**——金币领先越多，胜率越高，中间没有复杂的阈值效应或非线性跳跃。

逻辑回归的另一大优势在于可解释性：每个特征的系数直接告诉我们"这个因素每增加一个标准差，胜率对数几率变化多少"。综合考虑预测能力、可解释性和运算效率，**L1 正则化逻辑回归是本项目的最终推荐模型**。

---

## 6. 结论

本项目成功构建了基于前 10 分钟对局数据预测英雄联盟比赛胜负的机器学习模型，六种算法在测试集上均达到约 72% 的准确率。核心发现可以用一句话概括：**前期经济就是一切**——金币领先最多的 20% 队伍胜率高达 87%，落后最多的 20% 仅有 14%。在此之上，一血带来 +20pp 的胜率加成，控龙 +22pp，双目标联控则将胜率推高至 73%。

从课程知识运用的角度，本分析覆盖了多个核心 ML 概念：L1/L2 正则化展示了偏差-方差权衡的经典案例、GINI 不纯度驱动的递归分割诠释了决策树的本质、Bagging（随机森林）和 Boosting（梯度提升）分别演示了集成学习降低方差的两种路径、RBF 核 SVM 则验证了"复杂不一定更好"——线性模型在此场景下已足够。

未来可拓展的方向包括：引入英雄阵容数据以建模队伍强度曲线、对经济优势的时间演化做时序分析、以及加入玩家历史表现等个人维度的特征来进一步提升预测精度。

---

## 7. 参考文献

1. Fan, M. (2020). *League of Legends Diamond Ranked Games (10 min)*. Kaggle. [链接](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min)
2. Scikit-learn developers. Scikit-learn User Guide. [链接](https://scikit-learn.org/stable/user_guide.html)
3. 课程资料：STATS 101C Introduction to Statistical Models and Data Mining, UCLA.
4. 课程资料：AOS C111/204 Introduction to Machine Learning for Physical Sciences, UCLA.
5. League of Legends Wiki. *Minion*, *Gold income*, *Kill*, *Dragon Slayer*, *Dragon pit*.

---

**课程信息**: AOS C111/204 - Introduction to Machine Learning for Physical Sciences · UCLA 大气与海洋科学系 · Dr. Alexander Lozinski · 2025 年 12 月
