import { computed } from 'vue'

/**
 * Composable to access contact and location information configured via environment variables
 * (NUXT_PUBLIC_CONTACT_EMAIL, NUXT_PUBLIC_CONTACT_PHONE, NUXT_PUBLIC_WHATSAPP_NUMBER,
 *  NUXT_PUBLIC_LOCATION_ADDRESS, NUXT_PUBLIC_MAP_LATITUDE, NUXT_PUBLIC_MAP_LONGITUDE,
 *  NUXT_PUBLIC_MAP_COORDINATES, NUXT_PUBLIC_MAP_ZOOM).
 */
export const useContact = () => {
  const config = useRuntimeConfig()

  const email = computed<string>(() => {
    return (config.public.contactEmail as string) || 'info@netandsoft.com.ve'
  })

  const phone = computed<string>(() => {
    return (config.public.contactPhone as string) || '+58 414-478-5215'
  })

  const phoneRaw = computed<string>(() => {
    const raw = phone.value.replace(/[^\d+]/g, '')
    return raw.startsWith('+') ? raw : `+${raw}`
  })

  const whatsappNumber = computed<string>(() => {
    if (config.public.whatsappNumber) {
      return String(config.public.whatsappNumber).replace(/\D/g, '')
    }
    return phone.value.replace(/\D/g, '')
  })

  const address = computed<string>(() => {
    return (config.public.locationAddress as string) || '27 C. Muñoz, San Fernando de Apure 7001, Apure.'
  })

  const mapLatitude = computed<string>(() => {
    return String(config.public.mapLatitude || '7.8921750877067645')
  })

  const mapLongitude = computed<string>(() => {
    return String(config.public.mapLongitude || '-67.46952135309213')
  })

  const mapZoom = computed<string>(() => {
    return String(config.public.mapZoom || '13')
  })

  const mapCoordinates = computed<string>(() => {
    if (config.public.mapCoordinates) {
      return String(config.public.mapCoordinates).trim()
    }
    return `${mapLatitude.value}, ${mapLongitude.value}`
  })

  const mapUrl = computed<string>(() => {
    return `https://www.google.com/maps?q=${encodeURIComponent(mapCoordinates.value)}&z=${encodeURIComponent(mapZoom.value)}&output=embed`
  })

  const telLink = computed<string>(() => `tel:${phoneRaw.value}`)

  const mailtoLink = computed<string>(() => `mailto:${email.value}`)

  const getWhatsAppLink = (message?: string): string => {
    const cleanNumber = whatsappNumber.value
    if (!message) {
      return `https://wa.me/${cleanNumber}`
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  }

  return {
    email,
    phone,
    phoneRaw,
    whatsappNumber,
    address,
    mapLatitude,
    mapLongitude,
    mapZoom,
    mapCoordinates,
    mapUrl,
    telLink,
    mailtoLink,
    getWhatsAppLink
  }
}
