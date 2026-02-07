export function useData() {
    const store = useDataStore()
    const actions = storeToActions(store)
    const refs = storeToRefs(store)
    return { ...actions, ...refs }
}
