<script setup lang="ts">
    import { useForm } from '@tanstack/vue-form'

    useSeoMeta({ title: 'Quantum' })

    const form = useForm({
        defaultValues: {
            example: '',
        },
    })

    async function onSubmit() {
        await form.handleSubmit()
        console.log('Hola')
    }
</script>

<template>
    <div>
        <form @submit.prevent="onSubmit">
            <form.Field name="example">
                <input
                    placeholder="placeholder"
                    type="text"
                />
            </form.Field>
        </form>
    </div>
</template>
