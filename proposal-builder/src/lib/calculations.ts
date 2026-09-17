/**
 * Net & Soft Proposal Builder - Engine de Cálculos Financieros y Horas
 * Fórmulas puras sin efectos secundarios para cotizaciones comerciales.
 */

export interface PricingInput {
  monthlyPrice: number;
  includedHours: number;
  extraHourPrice: number;
  alertPercentage?: number;
  usedHours?: number;
  currency?: string;
}

export interface PricingResult {
  monthlyPrice: number;
  includedHours: number;
  pricePerHour: number;
  extraHourPrice: number;
  alertPercentage: number;
  alertHours: number;
  usedHours: number;
  remainingHours: number;
  extraHours: number;
  extraAmount: number;
  estimatedTotal: number;
  currency: string;
  // Formatos limpios para UI
  formatted: {
    monthlyPrice: string;
    includedHours: string;
    pricePerHour: string;
    extraHourPrice: string;
    alertHours: string;
    usedHours: string;
    remainingHours: string;
    extraHours: string;
    extraAmount: string;
    estimatedTotal: string;
  };
}

/**
 * Formatea un número monetario o numérico eliminando ceros decimales innecesarios.
 * Ej: 6 -> "6", 6.5 -> "6.50", 120 -> "120"
 */
export function formatCleanNumber(val: number, isCurrency = false, currencySymbol = "USD"): string {
  if (isNaN(val) || !isFinite(val)) {
    return isCurrency ? `${currencySymbol} 0` : "0";
  }

  // Redondear a 2 decimales para evitar problemas de coma flotante
  const rounded = Math.round((val + Number.EPSILON) * 100) / 100;
  const isInteger = rounded % 1 === 0;

  const numStr = isInteger ? rounded.toString() : rounded.toFixed(2);

  return isCurrency ? `${currencySymbol} ${numStr}` : numStr;
}

/**
 * Formatea minutos a rango de horas amigable.
 * Ej: 15 a 30 minutos -> "15 a 30 minutos"
 * Ej: 120 a 300 minutos -> "2 a 5 horas"
 */
export function formatMinutesFriendly(minMinutes: number, maxMinutes: number): string {
  if (minMinutes >= 60 && maxMinutes >= 60 && minMinutes % 60 === 0 && maxMinutes % 60 === 0) {
    const minH = minMinutes / 60;
    const maxH = maxMinutes / 60;
    return `${minH} a ${maxH} ${maxH === 1 ? "hora" : "horas"}`;
  }
  return `${minMinutes} a ${maxMinutes} minutos`;
}

/**
 * Ejecuta el cálculo completo del modelo de precios y horas de Net & Soft
 */
export function calculatePricing(input: PricingInput): PricingResult {
  const monthlyPrice = Math.max(0, Number(input.monthlyPrice) || 0);
  const includedHours = Math.max(0, Number(input.includedHours) || 0);
  const extraHourPrice = Math.max(0, Number(input.extraHourPrice) || 0);
  const alertPercentage = Math.min(100, Math.max(0, Number(input.alertPercentage ?? 80)));
  const usedHours = Math.max(0, Number(input.usedHours ?? 0));
  const currency = input.currency || "USD";

  // Precio por hora = precio mensual / horas incluidas
  const pricePerHour = includedHours > 0 ? monthlyPrice / includedHours : 0;

  // Horas de alerta de consumo = horas incluidas * (porcentaje / 100)
  const alertHours = (includedHours * alertPercentage) / 100;

  // Horas extras = max(horas utilizadas - horas incluidas, 0)
  const extraHours = Math.max(0, usedHours - includedHours);

  // Monto extra = horas extras * precio por hora adicional
  const extraAmount = extraHours * extraHourPrice;

  // Total estimado = precio mensual + monto extra
  const estimatedTotal = monthlyPrice + extraAmount;

  // Horas disponibles / restantes = max(horas incluidas - horas utilizadas, 0)
  const remainingHours = Math.max(0, includedHours - usedHours);

  return {
    monthlyPrice,
    includedHours,
    pricePerHour,
    extraHourPrice,
    alertPercentage,
    alertHours,
    usedHours,
    remainingHours,
    extraHours,
    extraAmount,
    estimatedTotal,
    currency,
    formatted: {
      monthlyPrice: formatCleanNumber(monthlyPrice, true, currency),
      includedHours: `${formatCleanNumber(includedHours)} horas`,
      pricePerHour: formatCleanNumber(pricePerHour, true, currency),
      extraHourPrice: formatCleanNumber(extraHourPrice, true, currency),
      alertHours: `${formatCleanNumber(alertHours)} horas`,
      usedHours: `${formatCleanNumber(usedHours)} horas`,
      remainingHours: `${formatCleanNumber(remainingHours)} horas`,
      extraHours: `${formatCleanNumber(extraHours)} horas`,
      extraAmount: formatCleanNumber(extraAmount, true, currency),
      estimatedTotal: formatCleanNumber(estimatedTotal, true, currency),
    },
  };
}
