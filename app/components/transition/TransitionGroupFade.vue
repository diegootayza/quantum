<script setup lang="ts">
    import { gsap } from 'gsap'

    interface Props {
        tag?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        tag: 'div',
    })

    const onEnter = (el: Element, done: () => void) => {
        gsap.fromTo(el, { opacity: 0, y: 20 }, { duration: 0.3, ease: 'power1.out', onComplete: done, opacity: 1, y: 0 })
    }

    const onLeave = (el: Element, done: () => void) => {
        gsap.to(el, {
            duration: 0.3,
            ease: 'power1.in',
            onComplete: done,
            opacity: 0,
            y: -20,
        })
    }
</script>

<template>
    <TransitionGroup
        :css="false"
        :tag="props.tag"
        @enter="onEnter"
        @leave="onLeave"
    >
        <slot />
    </TransitionGroup>
</template>
