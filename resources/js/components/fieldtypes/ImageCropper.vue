<template>
    <div v-if="source">
        <div class="flex flex-wrap gap-1">
            <Button
                v-for="dimension in dimensions"
                :key="dimension.key"
                :variant="crops[dimension.key] !== null ? 'primary' : 'default'"
                @click="openCropper(dimension)"
            >
                {{ dimension.label }}
            </Button>
        </div>

        <Stack v-model:open="cropper" title="Crop Image" size="full" @closed="closeCropper">
            <ImageCrop
                v-model:value="shadow"
                :source="source"
                :aspect-ratio="dimension?.ratio ?? undefined"
                :show-details="config.show_details"
            />

            <template #footer-end>
                <Button variant="default" @click="closeCropper">{{ __('Cancel') }}</Button>
                <Button variant="primary" @click="saveCropper">{{ __('Save') }}</Button>
            </template>
        </Stack>
    </div>
    <div v-else v-text="message" />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { Button, Stack } from '@statamic/cms/ui'
    import ImageCrop from './ImageCrop.vue'
    import { FieldtypeMixin as Fieldtype } from '@statamic/cms'

    interface CropData {
        x: number
        y: number
        width: number
        height: number
    }

    interface Dimension {
        key: string
        label: string
        ratio: number | null
    }

    interface Crops {
        [key: string]: CropData | null
    }

    export default defineComponent({
        components: { Button, Stack, ImageCrop },
        mixins: [Fieldtype],
        data(): { dimension: Dimension | null; cropper: boolean; shadow: CropData | null; crops: Crops } {
            return {
                dimension: null,
                cropper: false,
                shadow: null,
                crops: this.prepareCrops(this.value as Crops | null),
            }
        },
        computed: {
            dimensions(): Dimension[] {
                return Object.entries(this.meta.dimensions as Record<string, string>).map(([key, label]) => {
                    let ratio: number | null = null
                    if (key.includes('_')) {
                        const [width, height] = key.split('_')
                        ratio = Number(width) / Number(height)
                    }

                    return { key, label, ratio }
                })
            },
            sourceMeta(): Record<string, any> {
                return this.publishContainer.meta
            },
            sourceField(): any {
                return this.sourceMeta[this.config.source as string]
            },
            source(): string | null {
                const asset = this.sourceField?.data?.[0]

                return asset?.isImage ? asset.url || asset.downloadUrl : null
            },
            message(): string {
                return this.sourceField
                    ? __('Select an image to start cropping.')
                    : __('Image source field was not found.')
            },
        },
        watch: {
            source: {
                immediate: true,
                handler(cur: string | null, old: string | null) {
                    if (old && cur !== old) {
                        this.crops = this.prepareCrops()
                        this.update(this.crops)
                    }
                },
            },
        },
        methods: {
            prepareCrops(value?: Crops | null): Crops {
                const crops: Crops = Object.assign(
                    {},
                    ...Object.keys(this.meta.dimensions as Record<string, string>).map(key => ({ [key]: null }))
                )

                return value ? Object.assign(crops, value) : crops
            },
            openCropper(dimension: Dimension) {
                this.dimension = dimension
                this.shadow = this.crops[this.dimension.key]
                this.cropper = true
            },
            closeCropper() {
                this.cropper = false
                this.dimension = null
                this.shadow = null
            },
            saveCropper() {
                this.crops[this.dimension!.key] = this.shadow
                this.closeCropper()
                this.update(this.crops)
            },
        },
    })
</script>
