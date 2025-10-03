<template>
  <section id="contacto" class="section bg-white">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
        <span class="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
          Contáctanos
        </span>
        <h2 class="font-heading font-bold text-gray-900 mb-6">
          Estamos Aquí para <span class="text-gradient">Ayudarte</span>
        </h2>
        <p class="text-lg text-gray-600">
          ¿Tienes un proyecto en mente o necesitas asesoría tecnológica? Contáctanos y te responderemos lo antes posible.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Info -->
        <div class="space-y-8 animate-fade-in-up">
          <!-- Contact Cards -->
          <div class="space-y-6">
            <div 
              v-for="contact in contactInfo" 
              :key="contact.title"
              class="card group hover:border-primary/20 border border-transparent transition-all duration-300"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <component :is="contact.icon" class="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-heading font-semibold text-lg text-gray-900 mb-2">
                    {{ contact.title }}
                  </h3>
                  <p class="text-gray-600 mb-3">
                    {{ contact.description }}
                  </p>
                  <a 
                    v-if="contact.link"
                    :href="contact.link" 
                    :target="contact.external ? '_blank' : '_self'"
                    :rel="contact.external ? 'noopener noreferrer' : ''"
                    class="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors duration-300"
                  >
                    {{ contact.linkText }}
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <p v-else class="text-primary font-medium">
                    {{ contact.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- WhatsApp CTA -->
          <div class="p-8 rounded-2xl bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 border border-[#25D366]/20">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-heading font-semibold text-xl text-gray-900 mb-2">
                  ¿Prefieres WhatsApp?
                </h3>
                <p class="text-gray-600 mb-4">
                  Chatea con nosotros directamente y obtén respuestas inmediatas a tus consultas.
                </p>
                <a 
                  :href="whatsappLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn bg-[#25D366] text-white hover:bg-[#20BA5A] focus:ring-[#25D366]"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          </div>

          <!-- Map placeholder -->
          <div class="rounded-2xl overflow-hidden shadow-medium h-64 bg-gray-100 flex items-center justify-center">
            <div class="text-center text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p class="text-sm">Área de Cobertura Nacional</p>
            </div>
          </div>
        </div>

        <!-- Quick Contact Form -->
        <div class="animate-fade-in-up animation-delay-200">
          <div class="card">
            <h3 class="font-heading font-semibold text-2xl text-gray-900 mb-6">
              Envíanos un Mensaje
            </h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input 
                  id="name"
                  v-model="form.name"
                  type="text" 
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input 
                  id="phone"
                  v-model="form.phone"
                  type="tel" 
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="+58 321-849-7687"
                />
              </div>

              <div>
                <label for="service" class="block text-sm font-medium text-gray-700 mb-2">
                  Servicio de Interés
                </label>
                <select 
                  id="service"
                  v-model="form.service"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="desarrollo">Desarrollo de Software</option>
                  <option value="redes">Redes e Infraestructura</option>
                  <option value="cctv">Sistemas CCTV</option>
                  <option value="soporte">Soporte Técnico</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea 
                  id="message"
                  v-model="form.message"
                  required
                  rows="4"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Cuéntanos sobre tu proyecto..."
                ></textarea>
              </div>

              <button 
                type="submit"
                class="btn btn-primary w-full text-lg"
              >
                Enviar Mensaje
              </button>

              <p class="text-xs text-gray-500 text-center">
                Al enviar este formulario, aceptas nuestra política de privacidad
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'

const PhoneIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
  })
])

const EmailIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  })
])

const ClockIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const contactInfo = [
  {
    title: 'Teléfono',
    description: 'Llámanos para discutir tu proyecto',
    icon: PhoneIcon,
    value: '+58 414-478-5215', 
    link: 'tel:+584144785215',
    linkText: 'Llamar ahora',
    external: false
  },
  {
    title: 'Email',
    description: 'Envíanos un correo electrónico',
    icon: EmailIcon,
    value: 'info@netandsoft.com.ve',
    link: 'mailto:info@netandsoft.com.ve',
    linkText: 'Enviar email',
    external: false
  },
  {
    title: 'Horario',
    description: 'Estamos disponibles para ti',
    icon: ClockIcon,
    value: 'Lunes a Viernes: 8:00 AM - 6:00 PM'
  }
]

const form = ref({
  name: '',
  phone: '',
  service: '',
  message: ''
})

const whatsappLink = computed(() => {
  const phone = '584144785215'
  const message = encodeURIComponent('Hola, me gustaría obtener más información sobre los servicios de Net & Soft Solutions')
  return `https://wa.me/${phone}?text=${message}`
})

const handleSubmit = () => {
  // In a real application, this would send the form data to a backend
  const message = `Hola, soy ${form.value.name}. ${form.value.message}. Mi teléfono es ${form.value.phone}${form.value.service ? `. Estoy interesado en: ${form.value.service}` : ''}`
  const phone = '584144785215'
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  
  // Reset form
  form.value = {
    name: '',
    phone: '',
    service: '',
    message: ''
  }
}
</script>