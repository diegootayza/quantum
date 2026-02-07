export function useApp() {
    const store = useAppStore()
    const actions = storeToActions(store)
    const refs = storeToRefs(store)
    return { ...actions, ...refs }
}
