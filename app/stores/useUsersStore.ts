export const useUsersStore = defineStore('users-store', () => {
    const users = ref<Record<string, string[]>>({})

    function setUsers(newUsers: Record<string, string[]>) {
        users.value = newUsers
    }

    return { setUsers, users }
})
