import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { DateFieldConfig, FieldComponentProps } from '../../types/form';
import { formatIsoDate, parseIsoDate, toIsoDate } from '../../utils/date';
import { FieldWrapper, fieldStyles } from './FieldWrapper';

type Props = FieldComponentProps<DateFieldConfig, string>;

/**
 * Seletor de data para Android e iOS (@react-native-community/datetimepicker).
 * Na Web, o Metro usa automaticamente `DateField.web.tsx`.
 */
export function DateField({ field, value, error, onChange }: Props) {
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(new Date());

  const current = parseIsoDate(value) ?? new Date();
  const today = new Date();

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: current,
        mode: 'date',
        maximumDate: today,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === 'set' && date) onChange(field.id, toIsoDate(date));
        },
      });
      return;
    }
    setDraft(current);
    setIosOpen(true);
  };

  const confirmIos = () => {
    onChange(field.id, toIsoDate(draft));
    setIosOpen(false);
  };

  return (
    <FieldWrapper label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${field.label}: ${value ? formatIsoDate(value) : 'nenhuma data selecionada'}`}
        style={[fieldStyles.input, styles.trigger, error && fieldStyles.inputError]}
      >
        <Text style={[styles.text, !value && fieldStyles.placeholder]}>
          {value ? formatIsoDate(value) : (field.placeholder ?? 'DD/MM/AAAA')}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>

      {Platform.OS === 'ios' && (
        <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={() => setIosOpen(false)}>
          <View style={styles.backdrop}>
            <View style={styles.sheet}>
              <DateTimePicker
                value={draft}
                mode="date"
                display="inline"
                maximumDate={today}
                locale="pt-BR"
                onChange={(_event: DateTimePickerEvent, date?: Date) => date && setDraft(date)}
              />
              <View style={styles.actions}>
                <Pressable onPress={() => setIosOpen(false)} style={styles.action}>
                  <Text style={styles.actionMuted}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={confirmIos} style={styles.action}>
                  <Text style={styles.actionPrimary}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    fontSize: 16,
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  action: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  actionMuted: {
    color: colors.textMuted,
    fontSize: 16,
  },
  actionPrimary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
