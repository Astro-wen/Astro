---
title: 'Predicting League of Legends Match Outcomes from Early Game Statistics'
date: 2025-12-15
summary: 'Using machine learning to analyze 10-minute game data from 9,879 Diamond-tier matches and predict victory with 72% accuracy. Full technical report with code and figures.'
tags: ['machine-learning', 'lol', 'python', 'ucla', 'data-science']
cover: '/media/lol-report/figure4_model_comparison.png'
draft: false
---

> **Language**: This is the English version of the full report. [中文版请点此 →](/Astro/blog/ucla-c111-lol-prediction-zh)
>
> **Links**: [Project Website](https://astro-wen.github.io/UCLA_C111_LoL/) · [GitHub](https://github.com/Astro-wen/UCLA_C111_LoL) · [Dataset (Kaggle)](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min) · [Code (Colab)](https://colab.research.google.com/drive/1M3lTclYuREo6cQWqkfEM9ozNS7ymSdts?usp=sharing)

---

## Abstract

This project applies supervised machine learning techniques to predict League of Legends match outcomes based solely on statistics captured at the 10-minute mark. Using a dataset of 9,879 Diamond-tier ranked games, I trained and evaluated six classification models: Logistic Regression (with L1 and L2 regularization), Decision Trees, Random Forests, Gradient Boosting, and Support Vector Machines. All models achieved approximately 72% test accuracy, with Logistic Regression (L1) performing best in cross-validation (73.5% ± 1.5%) and achieving an AUC of 0.80. Feature importance analysis reveals that gold difference is the strongest predictor of victory (r = 0.51), followed by experience difference (r = 0.49). Quantitative analysis shows that securing first blood increases win probability by 20 percentage points, while controlling both dragon and herald leads to a 73% win rate. These findings provide data-driven strategic recommendations for players seeking to optimize their early-game decision-making.

---

## 1. Introduction

### League of Legends

League of Legends (LoL) is a multiplayer online battle arena (MOBA) game where two teams of five players compete to destroy the opposing team's base, known as the Nexus. Each match typically lasts 25-40 minutes and can be divided into three phases: the early game (0-15 minutes), mid game (15-25 minutes), and late game (25+ minutes). The early game, often called the "laning phase," is widely considered the foundation upon which victories are built.

During the laning phase, players focus on accumulating gold by killing enemy minions (small AI-controlled units that spawn periodically), securing kills against enemy champions (player-controlled characters), and taking neutral objectives like the Dragon (a powerful monster that grants team-wide buffs) and the Rift Herald (a monster that can be summoned to destroy enemy towers). The strategic decisions made during these critical first minutes—whether to play aggressively for kills, farm safely for gold, or rotate to help teammates—often determine the trajectory of the entire match.

Coaches and analysts in professional League of Legends frequently debate which early-game factors matter most. Some argue that securing First Blood (the first kill of the game, which grants bonus gold) provides crucial momentum, while others emphasize the importance of maintaining high CS (Creep Score, the number of minions killed) to ensure consistent gold income. This project addresses these questions through rigorous machine learning analysis.

The objectives of this study are threefold. First, I aim to build predictive models that can classify match winners using only statistics from the first 10 minutes. Second, I seek to identify which early-game factors most strongly influence victory through feature importance analysis. Third, I intend to provide quantitative strategic recommendations that players can use to optimize their early-game decision-making. By training models on nearly 10,000 high-level ranked games, this analysis moves beyond conventional wisdom to provide data-driven insights.

---

## 2. Data

### 2.1 Dataset Overview

The dataset used in this project is sourced from Kaggle and contains comprehensive statistics from 9,879 Diamond-tier ranked games, all captured at the 10-minute mark. Diamond tier represents approximately the top 2% of the player base and is normally seen as a benchmark between casual and professional players, which ensures that the data reflects skilled, competitive play rather than casual matches where fundamental mistakes might obscure strategic patterns. The choice of the 10-minute timestamp is significant because it captures the state of the game after the initial laning phase has developed but before major team objectives become available.

**Dataset Source:** [Kaggle - League of Legends Diamond Ranked Games 10 min](https://www.kaggle.com/datasets/bobbyscience/league-of-legends-diamond-ranked-games-10-min)

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

Output:
```
Dataset Shape: 9879 games × 40 features
Missing Values: 0
Blue team features: 20
Red team features: 19
```

### 2.2 Feature Description

The dataset contains 40 columns in total, consisting of one game identifier, one target variable, and 19 features for each of the two teams (Blue and Red). The features can be organized into several categories based on the game mechanics they represent.

The **target variable** is `blueWins`, a binary indicator where 1 means the Blue team won and 0 means the Red team won. Since the dataset is structured from the Blue team's perspective, all "blue" prefixed features represent the Blue team's statistics, while "red" prefixed features represent their opponents.

The **combat statistics** include `blueKills` (the number of enemy champions killed by the Blue team), `blueDeaths` (the number of times Blue team members were killed), and `blueAssists` (the number of kills where a Blue team member contributed damage but did not get the final blow).

The **economic indicators** are perhaps the most important category. `blueTotalGold` represents the total gold accumulated by the Blue team, while `blueGoldDiff` calculates the difference between Blue and Red team gold (positive values favor Blue). Similarly, `blueTotalExperience` and `blueExperienceDiff` track experience points, which determine champion levels.

The **farming statistics** measure how efficiently teams collect gold from minions. `blueTotalMinionsKilled` (also known as CS or Creep Score) counts lane minions killed, while `blueTotalJungleMinionsKilled` counts neutral jungle monsters.

The **objective control** features track major neutral objectives. `blueDragons` counts the number of dragons slain (typically 0 or 1 at 10 minutes). `blueHeralds` counts Rift Herald captures. `blueTowersDestroyed` counts enemy towers destroyed, and `blueFirstBlood` is a binary indicator for whether Blue team secured the first kill.

The **vision control** features include `blueWardsPlaced` and `blueWardsDestroyed`.

```python
win_counts = df['blueWins'].value_counts()
print("Target Variable Distribution:")
print(f"  Blue Team Wins: {win_counts[1]:,} ({win_counts[1]/len(df):.1%})")
print(f"  Red Team Wins:  {win_counts[0]:,} ({win_counts[0]/len(df):.1%})")
```

Output:
```
Target Variable Distribution:
  Blue Team Wins: 4,930 (49.9%)
  Red Team Wins:  4,949 (50.1%)
```

![Overall Win Distribution](/media/lol-report/Overall%20Win%20Distribution.png)

The target variable distribution reveals a nearly perfectly balanced dataset, with Blue team winning 49.9% of games and Red team winning 50.1%. This balance is ideal for classification problems because it means we can use accuracy as a reliable performance metric without concerns about class imbalance.

### 2.3 Exploratory Data Analysis

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

![Win Rate by Early Gold Lead](/media/lol-report/figure1_win_rate_by_gold.png)

The figure above reveals a striking relationship between gold advantage and win probability. Teams in the lowest gold quintile at 10 minutes win only 13.6% of their games, while teams in the highest quintile win 87.0%. This 73.4 percentage point difference is remarkably large and suggests that gold advantage is one of the most important factors in determining match outcomes.

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

![Feature Correlations with Victory](/media/lol-report/figure2_feature_correlations.png)

Gold Difference emerges as the strongest predictor with a correlation of 0.511, followed closely by Experience Difference at 0.490. Deaths show a strong negative correlation of -0.339, which is nearly symmetric with the positive correlation of Kills.

![Correlation Heatmap](/media/lol-report/figure2b_correlation_heatmap.png)

The correlation heatmap reveals that Gold Difference and Experience Difference are highly correlated with each other (r = 0.89), which makes intuitive sense. Kills and Assists show a very strong positive correlation (r = 0.81).

---

## 3. Methods

### 3.1 Feature Engineering

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

### 3.2 Feature Selection

From the available features, I selected 14 for inclusion in the final model.

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

Output:
```
Feature Matrix: 9879 samples × 14 features
```

### 3.3 Data Preprocessing

```python
# Train-test split with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training Set: {X_train.shape[0]} samples (Win Rate: {y_train.mean():.2%})")
print(f"Test Set:     {X_test.shape[0]} samples (Win Rate: {y_test.mean():.2%})")

# Feature standardization
scaler = StandardScaler()
X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=selected_features)
X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=selected_features)
```

Output:
```
Training Set: 7903 samples (Win Rate: 49.91%)
Test Set:     1976 samples (Win Rate: 49.90%)
```

### 3.4 Models

I implemented six classification models representing different machine learning paradigms.

#### 3.4.1 Logistic Regression (L2)

$$P(y=1|x) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + ... + \beta_n x_n)}}$$

```python
log_reg = LogisticRegression(penalty='l2', C=1.0, solver='lbfgs', max_iter=1000, random_state=42)
log_reg.fit(X_train_scaled, y_train)
results['Logistic Regression'] = evaluate_model(log_reg, X_train_scaled, X_test_scaled, y_train, y_test)

print("Logistic Regression (L2):")
print(f"  Train Accuracy: {results['Logistic Regression']['train_acc']:.4f}")
print(f"  Test Accuracy:  {results['Logistic Regression']['test_acc']:.4f}")
```

Output:
```
Logistic Regression (L2):
  Train Accuracy: 0.7359
  Test Accuracy:  0.7242
```

#### 3.4.2 Logistic Regression (L1 / Lasso)

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

Output:
```
Logistic Regression (L1):
  Train Accuracy: 0.7362
  Test Accuracy:  0.7242
  Features selected: 13/14
```

#### 3.4.3 Decision Tree

$$\text{GINI} = 1 - \sum_{i=1}^{C} p_i^2$$

```python
decision_tree = DecisionTreeClassifier(
    criterion='gini', max_depth=5, min_samples_split=50, min_samples_leaf=20, random_state=42
)
decision_tree.fit(X_train, y_train)
results['Decision Tree'] = evaluate_model(decision_tree, X_train, X_test, y_train, y_test)
```

Output:
```
Decision Tree:
  Train Accuracy: 0.7378
  Test Accuracy:  0.7196
```

#### 3.4.4 Random Forest

```python
random_forest = RandomForestClassifier(
    n_estimators=100, criterion='gini', max_depth=10, 
    min_samples_split=20, min_samples_leaf=10, random_state=42, n_jobs=-1
)
random_forest.fit(X_train, y_train)
results['Random Forest'] = evaluate_model(random_forest, X_train, X_test, y_train, y_test)
```

Output:
```
Random Forest:
  Train Accuracy: 0.7884
  Test Accuracy:  0.7201
```

#### 3.4.5 Gradient Boosting

```python
gradient_boosting = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42
)
gradient_boosting.fit(X_train, y_train)
results['Gradient Boosting'] = evaluate_model(gradient_boosting, X_train, X_test, y_train, y_test)
```

Output:
```
Gradient Boosting:
  Train Accuracy: 0.7495
  Test Accuracy:  0.7176
```

#### 3.4.6 Support Vector Machine (RBF Kernel)

$$K(x, x') = \exp\left(-\gamma ||x - x'||^2\right)$$

```python
svm_model = SVC(kernel='rbf', C=1.0, gamma='scale', probability=True, random_state=42)
svm_model.fit(X_train_scaled, y_train)
results['SVM (RBF)'] = evaluate_model(svm_model, X_train_scaled, X_test_scaled, y_train, y_test)
```

Output:
```
SVM (RBF Kernel):
  Train Accuracy: 0.7420
  Test Accuracy:  0.7176
```

### 3.5 Cross-Validation

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

Output:
```
Cross-Validation Results (5-Fold):
  Logistic Regression   : 0.7341 ± 0.0156
  Logistic Reg (L1)     : 0.7347 ± 0.0152
  Decision Tree         : 0.7131 ± 0.0082
  Random Forest         : 0.7291 ± 0.0131
  Gradient Boosting     : 0.7326 ± 0.0120
  SVM (RBF)             : 0.7269 ± 0.0117
```

### 3.6 Hyperparameter Tuning

![Hyperparameter Tuning](/media/lol-report/figure3_hyperparameter_tuning.png)

For Random Forest, increasing the number of estimators beyond 50 provides diminishing returns. For Gradient Boosting, the max_depth parameter shows a classic overfitting pattern — training accuracy reaches nearly 99% at depth=10, but test accuracy peaks around depth=3-4.

---

## 4. Results

### 4.1 Model Performance Comparison

| Model | Train Acc | Test Acc | Precision | Recall | F1 |
|-------|-----------|----------|-----------|--------|------|
| Logistic Regression (L2) | 0.7359 | 0.7242 | 0.7198 | 0.7323 | 0.7260 |
| Logistic Regression (L1) | 0.7362 | 0.7242 | 0.7190 | 0.7343 | 0.7265 |
| Decision Tree | 0.7378 | 0.7196 | 0.7333 | 0.6886 | 0.7103 |
| Random Forest | 0.7884 | 0.7201 | 0.7194 | 0.7201 | 0.7197 |
| Gradient Boosting | 0.7495 | 0.7176 | 0.7179 | 0.7150 | 0.7165 |
| SVM (RBF) | 0.7420 | 0.7176 | 0.7206 | 0.7089 | 0.7147 |

![Model Performance Comparison](/media/lol-report/figure4_model_comparison.png)

All models achieve approximately 72% test accuracy, suggesting this may represent an approximate ceiling for prediction using only 10-minute statistics.

### 4.2 ROC Curves and AUC Analysis

![ROC Curves](/media/lol-report/figure5_roc_curves.png)

| Model | AUC |
|-------|-----|
| Logistic Regression (L2) | 0.8064 |
| Logistic Regression (L1) | 0.8065 |
| Decision Tree | 0.7953 |
| Random Forest | 0.8062 |
| Gradient Boosting | 0.8065 |
| SVM (RBF) | 0.7841 |

### 4.3 Feature Importance Analysis

![Feature Importance](/media/lol-report/figure6_feature_importance.png)

Gold Difference emerges as the dominant predictor in both methods, with the highest Logistic Regression coefficient (over 1.0) and the highest Random Forest importance (0.27). Experience Difference ranks second in both methods.

### 4.4 Confusion Matrix

![Confusion Matrix](/media/lol-report/figure5_confusion_matrix.png)

The model correctly classified 713 Red wins (36.1%) and 710 Blue wins (35.9%), achieving an overall accuracy of 72%. The balanced error distribution reflects the balanced nature of the underlying game.

---

## 5. Discussion

### 5.1 Strategic Insights

#### Gold Quintile Analysis
- Bottom 20% gold: **13.6%** win rate
- Top 20% gold: **87.0%** win rate
- → Difference: **73.4 percentage points**

#### First Blood Impact
- Without First Blood: **39.7%** win rate
- With First Blood: **59.9%** win rate
- → Advantage: **+20.2 percentage points**

#### Dragon Control
- No Dragon: **41.9%** win rate
- 1 Dragon: **64.1%** win rate
- → Advantage: **+22.2 percentage points**

#### Herald Control
- No Herald: **47.7%** win rate
- Herald: **59.5%** win rate
- → Advantage: **+11.8 percentage points**

#### Both Objectives
- Neither objective: **39.9%** win rate
- Both objectives: **73.5%** win rate
- → Advantage: **+33.7 percentage points**

#### Kill Differential
- Behind 3+ kills: **18.8%** win rate
- Ahead 3+ kills: **83.9%** win rate
- → Swing: **65.1 percentage points**

### 5.2 Recommended Early-Game Strategy

1. **Maximize gold income through consistent farming** — aim for 7-8 CS/min
2. **Secure First Blood** when opportunities arise (+20pp advantage)
3. **Prioritize Dragon over Herald** (22% vs 12% impact)
4. **Minimize unnecessary deaths** (strong negative correlation -0.34)
5. **Recognize when behind and adjust** — passive play at -1,500 gold leads to ~14% win rate

### 5.3 Limitations: Why ~72% Accuracy

- Games are not determined at 10 minutes (25-40 min matches)
- Champion compositions missing from dataset
- Individual player skill varies within Diamond tier
- AFK/disconnect situations unpredictable

### 5.4 Model Selection Discussion

Simple Logistic Regression performs equally well as complex models, suggesting the relationship between early-game statistics and winning is approximately linear. The interpretability advantage and speed of Logistic Regression make it the preferred model.

---

## 6. Conclusion

This project successfully developed machine learning models to predict League of Legends match outcomes from early-game statistics, achieving approximately 72% accuracy across six different algorithms. The analysis reveals that gold difference is the strongest predictor of victory, with teams in the top gold quintile winning 87% of games compared to just 14% for teams in the bottom quintile.

Future work could extend this analysis by incorporating champion composition data, time-series analysis, and player-level features.

---

## 7. References

1. Fan, M. (2020). *League of Legends Diamond Ranked Games (10 min)*. Kaggle.
2. Scikit-learn developers. Scikit-learn User Guide.
3. Course Materials: STATS 101C Introduction to Statistical Models and Data Mining, UCLA.
4. Course Materials: AOS C111/204 Introduction to Machine Learning for Physical Sciences, UCLA.
5. League of Legends Wiki. *Minion*, *Gold income*, *Kill*, *Dragon Slayer*, *Dragon pit*.

---

**Course Information**: AOS C111/204 - Introduction to Machine Learning for Physical Sciences · UCLA Department of Atmospheric and Oceanic Sciences · Dr. Alexander Lozinski · December 2025
