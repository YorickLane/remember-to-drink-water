/**
 * 时间选择器组件
 */

import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

interface TimePickerProps {
  label: string;
  value: string; // 格式：HH:mm
  onChange: (time: string) => void;
}

export function TimePicker({ label, value, onChange }: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(() => {
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  });

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
        onChange(`${hours}:${minutes}`);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleConfirm = () => {
    const hours = tempDate.getHours().toString().padStart(2, '0');
    const minutes = tempDate.getMinutes().toString().padStart(2, '0');
    onChange(`${hours}:${minutes}`);
    setShowPicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCancel = () => {
    setShowPicker(false);
    // 重置为当前值
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    setTempDate(date);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setShowPicker(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{value}</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* iOS 使用 Modal，Android 直接显示原生选择器 */}
      {Platform.OS === 'ios' && showPicker && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancel}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelButton}>取消</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmButton}>确定</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                locale="zh-CN"
                textColor="#000"
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Android 原生时间选择器 */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          is24Hour={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  arrow: {
    fontSize: 20,
    color: '#C7C7CC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  confirmButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
});
