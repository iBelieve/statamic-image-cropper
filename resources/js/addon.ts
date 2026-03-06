import ImageCropper from './components/fieldtypes/ImageCropper.vue'

Statamic.booting(() => {
    Statamic.$components.register('image_cropper-fieldtype', ImageCropper)
})
