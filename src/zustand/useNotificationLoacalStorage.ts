import useLocalStorage from '@/hooks/use-local-storage';

function useNotificationLocalStorage() {
  const updateLocalStorage = useLocalStorage<Notification[]>('notifications', [])[1]; // Get setter
  return updateLocalStorage;
}

export default useNotificationLocalStorage;