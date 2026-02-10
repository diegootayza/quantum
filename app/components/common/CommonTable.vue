<script setup lang="ts" generic="T extends RecordType">
    interface Props {
        data?: T[]
    }

    const props = withDefaults(defineProps<Props>(), {
        data: () => [],
        meta: undefined,
    })
</script>

<template>
    <div class="w-full flex-1 bg-accented">
        <div>
            <table>
                <thead>
                    <tr>
                        <th>x</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>y</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
