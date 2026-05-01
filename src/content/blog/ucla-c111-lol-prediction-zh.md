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

本项目应用监督式机器学习技术，仅基于 10 分钟时的比赛数据来预测英雄联盟比赛胜负。使用包含 9,879 场钻石段位排位赛的数据集，我训练并评估了六种分类模型：Logistic Regression（L1 和 L2 正则化）、Decision Tree、Random Forest、Gradient Boosting 和 SVM。所有模型均达到约 72% 的测试准确率，其中 L1 正则化 Logistic Regression 在交叉验证中表现最佳（73.5% ± 1.5%），AUC 达到 0.80。特征重要性分析表明，金币差是胜负最强的预测因子（r = 0.51），其次是经验差（r = 0.49）。量化分析显示，获得一血将胜率提高 20 个百分点，同时控龙和先锋的队伍胜率高达 73%。这些发现为玩家优化前期决策提供了数据驱动的战略建议。

---

## 1. 引言

### 英雄联盟

英雄联盟（League of Legends, LoL）是一款多人在线竞技场（MOBA）游戏，两支五人队伍竞争摧毁对方的基地——水晶枢纽（Nexus）。每场比赛通常持续 25-40 分钟，可以分为三个阶段：前期（0-15 分钟）、中期（15-25 分钟）和后期（25 分钟以上）。前期通常被称为"对线期"，被广泛认为是胜利的基础。

在对线期，玩家通过击杀小兵（定期刷新的 AI 控制单位）积累金币，通过击杀敌方英雄获取击杀金，并争夺中立目标——如小龙（Dragon，提供全队增益 buff）和峡谷先锋（Rift Herald，可被召唤摧毁敌方防御塔）。这些关键前几分钟的战略决策——是否积极进攻拿人头、安全发育赚金币，还是转线支援队友——往往决定了整场比赛的走向。

职业英雄联盟的教练和分析师经常争论哪些前期因素最为关键。有人认为拿到一血（First Blood，比赛第一次击杀，额外奖励金币）能提供关键的节奏优势，也有人强调保持高 CS（Creep Score，补刀数）以确保稳定金币收入的重要性。本项目通过严谨的机器学习分析来回答这些问题。

本研究的目标有三个：第一，构建仅使用前 10 分钟数据就能预测胜负的分类模型；第二，通过特征重要性分析识别哪些前期因素最强烈地影响胜负；第三，提供量化的战略建议，供玩家优化前期决策。通过在近 10,000 场高水平排位赛上训练模型，本分析超越了传统经验，提供数据驱动的洞见。

---

## 2. 数据

### 2.1 数据集概览

本项目使用的数据集来源于 Kaggle，包含 9,879 场钻石段位排位赛的综合数据，均在 10 分钟时采集。钻石段位代表约前 2% 的玩家群体，通常被视为休闲玩家和职业选手之间的分水岭，这保证了数据反映的是有技巧的、竞技性的对局，而非因基本失误掩盖了战略规律的休闲比赛。选择 10 分钟这个时间节点也很有意义——它捕捉了对线期发展后的游戏状态，但在主要团队目标可用之前。

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

目标变量分布几乎完美平衡——蓝队胜率 49.9%，红队 50.1%。这种平衡对分类问题来说非常理想，因为它意味着我们可以直接用准确率作为可靠的性能指标，无需担心类别不平衡的问题。

### 2.3 探索性数据分析

在构建预测模型之前，有必要先理解前期数据与比赛结果之间的关系。

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

上图揭示了金币优势与胜率之间惊人的关系。10 分钟时金币最低五分位的队伍胜率仅 **13.6%**，而最高五分位的队伍胜率高达 **87.0%**。73.4 个百分点的差距极为显著，说明金币优势是决定比赛结果最重要的因素之一。

用实际游戏场景来理解：一支队伍如果早期拿到两个击杀（共约 600 金币），再保持 10 CS 的补刀优势（约 200 金币），这 800 金币的领先可能足以将他们从中间五分位推到第四五分位，预期胜率从约 49% 提升到 67%。英雄联盟中优势的「滚雪球」本质——金币买装备使赚取更多金币更容易——解释了为什么前期领先如此强烈地转化为最终胜利。

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

金币差以 0.511 的相关系数成为最强预测因子，经验差紧随其后为 0.490。击杀的相关性（0.338）明显低于金币差，这揭示了一个重要的战略洞见：**击杀的价值主要来自于它产生的金币和经验，而非击杀本身**。一支拿到很多人头但未能将其转化为金币优势的队伍，可能看不到预期的收益。

死亡呈现 -0.339 的强负相关，与击杀几乎对称。这种对称性意味着避免死亡可能比拿到击杀**略微更重要**——印证了"落后时打稳"这一常见建议。

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

所有模型测试集准确率均在 ~72% 附近——从线性模型到树集成到核方法——一致性表明：前 10 分钟数据能解释的胜率上限约为 72%，剩下 28% 取决于英雄阵容、个人操作和中后期决策。

Logistic Regression 展现了出色的泛化能力，训练-测试差距仅 1.2%。相比之下，Random Forest 过拟合差距达 6.8%，Gradient Boosting 为 3.3%。

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

- **比赛并非在 10 分钟决定**——25-40 分钟的比赛还有大量变数
- **数据缺少英雄阵容信息**——某些后期阵容故意牺牲前期
- **个人技术水平有差异**——即使在钻石段位内
- **AFK/掉线**等不可预测因素

72% 应被正面解读：它说明前期表现能解释相当大一部分比赛结果，足以提供可执行的战略建议。剩下的 28% 正是英雄联盟作为竞技游戏的魅力所在。

### 5.4 模型选择讨论

尽管测试了含 100 棵树的 Random Forest 和 RBF 核 SVM 等复杂模型，简单的 Logistic Regression 表现同样出色。这表明前期数据与胜负之间的关系本质上是**近似线性的**——金币优势平滑地转化为胜率，不存在复杂的阈值效应。

Logistic Regression 的可解释性优势是巨大的：系数直接告诉我们每个特征如何影响胜率。综合考虑准确率、可解释性和运行速度，**推荐使用 L1 正则化 Logistic Regression** 作为首选模型。

---

## 6. 结论

本项目成功开发了基于前期数据预测英雄联盟比赛结果的机器学习模型，六种算法均达到约 72% 的准确率。分析揭示金币差是最强的胜负预测因子——金币最高五分位的队伍胜率 87%，最低五分位仅 14%。一血带来 20 个百分点的胜率优势，控龙增加 22 个百分点，同时控龙和先锋的队伍胜率高达 73%。

本分析综合运用了课程中的多个机器学习概念：Logistic Regression 的 L1/L2 正则化展示了偏差-方差权衡、决策树用 GINI 不纯度递归分割特征空间、Random Forest 和 Gradient Boosting 展示了集成方法如何通过不同聚合策略降低方差、SVM 的 RBF 核提供了非线性替代方案——最终证实线性模型足以应对此问题。

未来的工作可以在几个方向扩展：引入英雄阵容数据以考虑队伍强度曲线、对优势如何在比赛中演变进行时间序列分析、以及加入玩家级别特征来捕捉个体技术差异。

---

## 7. 参考文献

1. Fan, M. (2020). *League of Legends Diamond Ranked Games (10 min)*. Kaggle. [链接](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min)
2. Scikit-learn developers. Scikit-learn User Guide. [链接](https://scikit-learn.org/stable/user_guide.html)
3. 课程资料：STATS 101C Introduction to Statistical Models and Data Mining, UCLA.
4. 课程资料：AOS C111/204 Introduction to Machine Learning for Physical Sciences, UCLA.
5. League of Legends Wiki. *Minion*, *Gold income*, *Kill*, *Dragon Slayer*, *Dragon pit*.

---

**课程信息**: AOS C111/204 - Introduction to Machine Learning for Physical Sciences · UCLA 大气与海洋科学系 · Dr. Alexander Lozinski · 2025 年 12 月
