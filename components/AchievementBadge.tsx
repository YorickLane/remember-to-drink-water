/**
 * 成就徽章组件
 */

import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Achievement } from '@/types/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
}

export function AchievementBadge({ achievement, size = 'medium' }: AchievementBadgeProps) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const isUnlocked = achievement.unlockedAt !== null;

  const sizeStyles = {
    small: { badge: 40, icon: 20, fontSize: 10 },
    medium: { badge: 56, icon: 28, fontSize: 12 },
    large: { badge: 72, icon: 36, fontSize: 14 },
  };

  const s = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: s.badge,
            height: s.badge,
            borderRadius: s.badge / 2,
            backgroundColor: isUnlocked ? colors.achievementUnlocked : colors.achievementLocked,
            opacity: isUnlocked ? 1 : 0.5,
          },
        ]}
      >
        <Text style={[styles.icon, { fontSize: s.icon }]}>
          {isUnlocked ? achievement.icon : '🔒'}
        </Text>
      </View>
      <Text
        style={[
          styles.title,
          {
            fontSize: s.fontSize,
            color: isUnlocked ? colors.text : colors.textTertiary,
          },
        ]}
        numberOfLines={2}
      >
        {t(`achievements.${achievement.id}.title`)}
      </Text>
      {!isUnlocked && achievement.progress > 0 && (
        <Text style={[styles.progress, { color: colors.textSecondary, fontSize: s.fontSize - 2 }]}>
          {achievement.progress}/{achievement.target}
        </Text>
      )}
    </View>
  );
}

interface AchievementListProps {
  achievements: Achievement[];
  title?: string;
}

export function AchievementList({ achievements, title }: AchievementListProps) {
  const { colors } = useThemeColors();

  if (achievements.length === 0) return null;

  return (
    <View style={[styles.listContainer, { backgroundColor: colors.cardBackground }]}>
      {title && (
        <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
      )}
      <View style={styles.badgeGrid}>
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginBottom: 16,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {},
  title: {
    textAlign: 'center',
    lineHeight: 16,
  },
  progress: {
    marginTop: 2,
  },
  listContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});
