import React, { useEffect } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { ThemedView, ThemedText } from '../../../src/components';
import { ControlledInput } from '../../../src/components/ControlledInput';
import AppButton from '../../../src/components/AppButton';
import { useTranslation } from 'react-i18next';
import { motosHttpService } from '../../../src/services/motosHttpService';
import { useLocalSearchParams, useRouter } from 'expo-router';

type FormValues = {
  modelo: string;
  placa: string;
  patio?: string;
  km?: string;
};

export default function EditMotoScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const { t } = useTranslation();
  const router = useRouter();
  const { control, handleSubmit, setValue, formState } = useForm<FormValues>({ defaultValues: { modelo: '', placa: '', patio: '', km: '' } });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const data = await motosHttpService.get(Number(id));
        if (!mounted) return;
        setValue('modelo', data.modelo || '');
        setValue('placa', data.placa || '');
        setValue('patio', data.patioId ? String(data.patioId) : '');
        setValue('km', data.km ? String(data.km) : '');
      } catch (err) {
        console.warn(err);
        Alert.alert(t('error_label'), t('fetch_fail'));
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        modelo: data.modelo,
        placa: data.placa,
        patioId: data.patio ? Number(data.patio) : undefined,
        km: data.km ? Number(data.km) : undefined,
      } as any;
      await motosHttpService.update(Number(id), payload);
      Alert.alert(t('success_label'), t('motos.updated_success'));
      router.back();
    } catch (err) {
      console.warn(err);
      Alert.alert(t('error_label'), t('motos.update_fail'));
    }
  };

  if (!id) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 12 }}>{t('motos.edit_title')}</ThemedText>
  <ControlledInput name="modelo" control={control} placeholder={t('placeholders.modelo') || 'Modelo'} />
  <ControlledInput name="placa" control={control} placeholder={t('placeholders.placa') || 'ABC-1234'} />
  <ControlledInput name="patio" control={control} placeholder={t('placeholders.patio') || 'ID do pátio'} keyboardType="numeric" />
  <ControlledInput name="km" control={control} placeholder={t('placeholders.km') || 'KM'} keyboardType="numeric" />

  <View style={{ height: 16 }} />
  <AppButton title={t('buttons.save')} loading={formState.isSubmitting} onPress={handleSubmit(onSubmit) as any} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
