<script setup lang="ts">
    import { gsap } from 'gsap'

    const onEnter = (el: Element, onComplete: () => void) => {
        gsap.fromTo(el, { opacity: 0 }, { duration: 0.2, ease: 'power1.inOut', onComplete, opacity: 1 })
    }

    const onLeave = (el: Element, onComplete: () => void) => {
        gsap.fromTo(el, { opacity: 1 }, { duration: 0.2, ease: 'power1.inOut', onComplete, opacity: 0 })
    }
</script>

<template>
    <Transition
        :css="false"
        @enter="onEnter"
        @leave="onLeave"
    >
        <slot />
    </Transition>
</template>
