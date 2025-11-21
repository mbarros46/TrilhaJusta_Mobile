import React from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { ThemedView, ThemedText } from '../../src/components';
import { ControlledInput } from '../../src/components/ControlledInput';
import AppButton from '../../src/components/AppButton';
import { useTranslation } from 'react-i18next';
import { motosHttpService } from '../../src/services/motosHttpService';
import { useRouter } from 'expo-router';

type FormValues = {
  modelo: string;
  placa: string;
  patio?: string;
  km?: string;
};

export default function NewMotoScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { modelo: '', placa: '', patio: '', km: '' },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        modelo: data.modelo,
        placa: data.placa,
        patioId: data.patio ? Number(data.patio) : undefined,
        km: data.km ? Number(data.km) : undefined,
      } as any;

      await motosHttpService.create(payload);
      Alert.alert(t('success_label'), t('motos.created_success'));
      router.back();
    } catch (err) {
      console.warn(err);
      Alert.alert(t('error_label'), t('motos.create_fail'));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 12 }}>{t('motos.create_title')}</ThemedText>

  <ControlledInput name="modelo" control={control} placeholder={t('placeholders.modelo') || 'Modelo'} />
  <ControlledInput name="placa" control={control} placeholder={t('placeholders.placa') || 'ABC-1234'} />
  <ControlledInput name="patio" control={control} placeholder={t('placeholders.patio') || 'ID do pátio'} keyboardType="numeric" />
  <ControlledInput name="km" control={control} placeholder={t('placeholders.km') || 'KM'} keyboardType="numeric" />

      <View style={{ height: 16 }} />
      <AppButton title={t('buttons.create_moto')} loading={formState.isSubmitting} onPress={handleSubmit(onSubmit) as any} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
