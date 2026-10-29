import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { ChoiceFieldConfig, FieldComponentProps } from '../../types/form';
import { FieldWrapper, fieldStyles } from './FieldWrapper';

type Props = FieldComponentProps<ChoiceFieldConfig, string>;

/**
 * Combo/select implementado com Modal + FlatList do próprio React Native,
 * garantindo o mesmo comportamento em Android, iOS e Web.
 */
export function SelectField({ field, value, error, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => field.options.find((option) => option.value === value)?.label,
    [field.options, value],
  );

  const choose = (optionValue: string) => {
    onChange(field.id, optionValue);
    setOpen(false);
  };

  return (
    <FieldWrapper label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${field.label}: ${selectedLabel ?? 'nenhuma opção selecionada'}`}
        style={[fieldStyles.input, styles.trigger, error && fieldStyles.inputError]}
      >
        <Text style={[styles.triggerText, !selectedLabel && fieldStyles.placeholder]}>
          {selectedLabel ?? field.placeholder ?? 'Selecione...'}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>{field.label}</Text>
            <FlatList
              data={field.options}
              keyExtractor={(option) => option.value}
              renderItem={({ item }) => {
                const selected = item.value === value;
                return (
                  <Pressable
                    onPress={() => choose(item.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={({ pressed }) => [styles.item, selected && styles.itemSelected, pressed && styles.pressed]}
                  >
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item.label}</Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              }}
            />
            <Pressable onPress={() => setOpen(false)} style={styles.cancel} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  chevron: {
    fontSize: 16,
    color: colors.textMuted,
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  itemSelected: {
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
  itemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  check: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  cancel: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
