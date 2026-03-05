<template>
    <div v-if="source">
        <div class="flex flex-wrap gap-1">
            <ui-button
                v-for="dimension in dimensions"
                :key="dimension.key"
                :variant="crops[dimension.key] !== null ? 'primary' : 'default'"
                size="sm"
                @click="openCropper(dimension)"
            >
                {{ dimension.label }}
            </ui-button>
        </div>

        <Stack v-model:open="cropper" title="Crop Image" full @closed="closeCropper">
            <div class="flex h-full flex-col bg-white p-3 dark:bg-gray-900">
                <ImageCrop
                    v-model:value="shadow"
                    :source="source"
                    :aspect-ratio="dimension.ratio"
                    :show-details="config.show_details"
                />

                <div class="mt-2 flex justify-end gap-2">
                    <ui-button variant="default" @click="closeCropper">{{ __('Cancel') }}</ui-button>
                    <ui-button variant="primary" @click="saveCropper">{{ __('Save') }}</ui-button>
                </div>
            </div>
        </Stack>
    </div>
    <div v-else v-text="message" />
</template>

<script>
    import ImageCrop from './ImageCrop.vue'
    import { FieldtypeMixin as Fieldtype } from '@statamic/cms'
    export default {
        components: { ImageCrop },
        mixins: [Fieldtype],
        data() {
            return {
                dimension: null,
                cropper: false,
                shadow: null,
                crops: this.prepareCrops(this.value),
            }
        },
        computed: {
            dimensions() {
                return Object.entries(this.meta.dimensions).map(([key, label]) => {
                    let ratio = null
                    if (key.includes('_')) {
                        const [width, height] = key.split('_')
                        ratio = width / height
                    }

                    return { key, label, ratio }
                })
            },
            sourceMeta() {
                return this.publishContainer.meta
            },
            sourceField() {
                return this.sourceMeta[this.config.source]
            },
            source() {
                const asset = this.sourceField?.data?.[0]

                return asset?.isImage ? asset.url || asset.downloadUrl : null
            },
            message() {
                return this.sourceField
                    ? __('Select an image to start cropping.')
                    : __('Image source field was not found.')
            },
        },
        watch: {
            source: {
                immediate: true,
                handler(cur, old) {
                    if (old && cur !== old) {
                        this.crops = this.prepareCrops()
                        this.update(this.crops)
                    }
                },
            },
        },
        methods: {
            prepareCrops(value) {
                const crops = Object.assign({}, ...Object.keys(this.meta.dimensions).map(key => ({ [key]: null })))

                return value ? Object.assign(crops, value) : crops
            },
            openCropper(dimension) {
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
                this.crops[this.dimension.key] = this.shadow
                this.closeCropper()
                this.update(this.crops)
            },
        },
    }
</script>
