import type { Component, ComponentOptionsMixin } from 'vue'

declare global {
    const Statamic: {
        booting(callback: () => void): void
        $components: {
            register(name: string, component: Component): void
        }
    }

    function __(key: string, replacements?: Record<string, string>): string
}

// The @statamic/cms runtime exports FieldtypeMixin directly, but the shipped
// type declarations namespace it under `core` and type it as DefineSetupFnComponent
// which doesn't work for Options API mixin merging. Use ComponentOptionsMixin so
// Vue's defineComponent can accept it without breaking type inference.
declare module '@statamic/cms' {
    export const FieldtypeMixin: ComponentOptionsMixin
}

// Augment Vue's component instance type with Statamic globals and Fieldtype
// mixin properties. The mixin injects these at runtime but its shipped types
// (DefineSetupFnComponent) don't support Options API mixin type merging.
declare module 'vue' {
    interface ComponentCustomProperties {
        __(key: string, replacements?: Record<string, string>): string
        value: any
        config: Record<string, any>
        meta: Record<string, any>
        handle: string
        readOnly: boolean
        publishContainer: Record<string, any>
        update(value: any): void
    }
}
