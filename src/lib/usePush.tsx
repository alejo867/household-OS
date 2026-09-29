import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './useAuth'

// Public VAPID key only — safe to ship in the client bundle. It just lets
// the browser verify that push messages come from our server; it grants no
// account or data access on its own.
const VAPID_PUBLIC_KEY =
  'BC06WbhEBL-Ra_1sdqt2wcNAxcC4_KEX3FnJ9K8XaKpocxEFJ8DfkSNKgDgTIGoBrELOLmIUuenfOemPHazjpOw'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export function usePush() {
  const { user } = useAuth()
  const supported =
    typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : 'denied'
  )
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!supported || !user) {
      setChecked(true)
      return
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => setSubscribed(false))
      .finally(() => setChecked(true))
  }, [supported, user])

  const subscribe = useCallback(async () => {
    if (!supported || !user) return { error: 'Push notifications are not supported on this device.' }
    setLoading(true)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        return { error: 'Notification permission was not granted.' }
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })

      const json = subscription.toJSON()
      const { error } = await supabase.from('push_subscriptions').upsert(
        {
          user_id: user.id,
          endpoint: json.endpoint!,
          p256dh: json.keys!.p256dh,
          auth: json.keys!.auth
        },
        { onConflict: 'endpoint' }
      )
      if (error) return { error: error.message }

      setSubscribed(true)
      return {}
    } catch (e: any) {
      return { error: e?.message ?? 'Could not enable notifications.' }
    } finally {
      setLoading(false)
    }
  }, [supported, user])

  const unsubscribe = useCallback(async () => {
    if (!supported) return
    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)
        await subscription.unsubscribe()
      }
      setSubscribed(false)
    } finally {
      setLoading(false)
    }
  }, [supported])

  return { supported, permission, subscribed, loading, checked, subscribe, unsubscribe }
}
