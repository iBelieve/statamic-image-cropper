<template>
    <div class="flex h-full gap-1">
        <div class="w-3/4 px-1">
            <div class="relative mx-auto h-full" :style="containerStyle">
                <img ref="cropper" :src="source" class="object-cover" />
            </div>
        </div>
        <div class="w-1/4 px-1">
            <div ref="preview" class="overflow-hidden">
                <img :src="source" />
            </div>

            <div class="flex">
                <Button variant="default" class="mt-2" @click="handleReset">{{ __('Reset') }}</Button>

                <dl v-if="showDetails && value" class="ml-2 mt-2 inline-block text-sm">
                    <div class="flex rounded border border-gray-300">
                        <dt class="w-20 bg-gray-300 px-1.5 py-1">{{ __('X') }}</dt>
                        <dd class="w-20 px-1.5 py-1 text-right">{{ value.x }}px</dd>
                    </div>
                    <div class="mt-1 flex rounded border border-gray-300">
                        <dt class="w-20 bg-gray-300 px-1.5 py-1">{{ __('Y') }}</dt>
                        <dd class="w-20 px-1.5 py-1 text-right">{{ value.y }}px</dd>
                    </div>
                    <div class="mt-1 flex rounded border border-gray-300">
                        <dt class="w-20 bg-gray-300 px-1.5 py-1">{{ __('Width') }}</dt>
                        <dd class="w-20 px-1.5 py-1 text-right">{{ value.width }}px</dd>
                    </div>
                    <div class="mt-1 flex rounded border border-gray-300">
                        <dt class="w-20 bg-gray-300 px-1.5 py-1">{{ __('Height') }}</dt>
                        <dd class="w-20 px-1.5 py-1 text-right">{{ value.height }}px</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { Button } from '@statamic/cms/ui'
    import Cropper from 'cropperjs'
    import 'cropperjs/dist/cropper.css'

    interface CropData {
        x: number
        y: number
        width: number
        height: number
    }

    interface ImageDimension {
        width: number
        height: number
    }

    export default defineComponent({
        name: 'ImageCrop',
        components: { Button },
        props: {
            value: Object as () => CropData | null,
            source: {
                type: String,
                required: true,
            },
            aspectRatio: Number,
            showDetails: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['update:value'],
        data(): { cropper: Cropper | null; dimension: ImageDimension | null } {
            return {
                cropper: null,
                dimension: null,
            }
        },
        computed: {
            containerStyle(): Record<string, string> | null {
                if (this.dimension) {
                    const { width, height } = this.dimension

                    return { width: `${width}px !important`, height: `${height}px !important` }
                }

                return null
            },
        },
        mounted() {
            const imgEl = this.$refs.cropper as HTMLImageElement
            imgEl.onload = () => {
                const { width, height } = imgEl
                this.dimension = { width, height }
                this.setupCropper()
            }
        },
        beforeUnmount() {
            this.cropper!.destroy()
        },
        methods: {
            setupCropper() {
                const cropper = this.$refs.cropper as HTMLImageElement
                const preview = this.$refs.preview as HTMLDivElement
                this.cropper = new Cropper(cropper, {
                    aspectRatio: this.aspectRatio,
                    autoCropArea: 1,
                    data: this.value as Cropper.Data | undefined,
                    preview: preview,
                    responsive: true,
                    zoomable: false,
                    crop: (evt: Cropper.CropEvent) => {
                        const {
                            detail: { x, y, width, height },
                        } = evt
                        this.$emit('update:value', {
                            x: Math.max(0, Math.round(x)),
                            y: Math.max(0, Math.round(y)),
                            width: Math.round(width),
                            height: Math.round(height),
                        })
                    },
                })
            },
            handleReset() {
                this.cropper!.reset()
                this.$emit('update:value', null)
            },
        },
    })
</script>

<style scoped>
    .object-cover {
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
