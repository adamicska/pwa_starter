"use client"

export interface PWAServiceWorkerRegistration {
  register: () => Promise<ServiceWorkerRegistration | undefined>
  unregister: () => Promise<boolean>
  update: () => Promise<ServiceWorkerRegistration | undefined>
  getRegistration: () => Promise<ServiceWorkerRegistration | undefined>
}

export const serviceWorkerRegistration: PWAServiceWorkerRegistration = {
  async register(): Promise<ServiceWorkerRegistration | undefined> {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, show update prompt
                window.dispatchEvent(new CustomEvent('swUpdate', {
                  detail: { registration }
                }))
              }
            })
          }
        })

        console.log('ServiceWorker registered successfully:', registration)
        return registration
      } catch (error) {
        console.error('ServiceWorker registration failed:', error)
      }
    }
  },

  async unregister(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          return await registration.unregister()
        }
      } catch (error) {
        console.error('ServiceWorker unregistration failed:', error)
      }
    }
    return false
  },

  async update(): Promise<ServiceWorkerRegistration | undefined> {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          return await registration.update()
        }
      } catch (error) {
        console.error('ServiceWorker update failed:', error)
      }
    }
  },

  async getRegistration(): Promise<ServiceWorkerRegistration | undefined> {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        return await navigator.serviceWorker.getRegistration()
      } catch (error) {
        console.error('Failed to get ServiceWorker registration:', error)
      }
    }
  }
}
