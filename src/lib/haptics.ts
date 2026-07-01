import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const hapticImpactLight = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    // Fallback if not on mobile/device
  }
};

export const hapticImpactMedium = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
  }
};

export const hapticImpactHeavy = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (e) {
  }
};

export const hapticSuccess = async () => {
  try {
    await Haptics.notification({ type: 'SUCCESS' as any });
  } catch (e) {
  }
};

export const hapticWarning = async () => {
  try {
    await Haptics.notification({ type: 'WARNING' as any });
  } catch (e) {
  }
};

export const hapticError = async () => {
  try {
    await Haptics.notification({ type: 'ERROR' as any });
  } catch (e) {
  }
};
