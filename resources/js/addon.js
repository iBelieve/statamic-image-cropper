import ImageCropper from './components/fieldtypes/ImageCropper.vue'

Statamic.booting(() => {
    Statamic.component('ImageCropperFieldtype', ImageCropper)
})
