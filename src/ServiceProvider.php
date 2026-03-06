<?php

namespace IBelieve\StatamicImageCropper;

use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $fieldtypes = [
        Fieldtypes\ImageCropper::class,
    ];

    protected $vite = [
        'input' => [
            'resources/js/addon.js',
            'resources/css/addon.css',
        ],
        'publicDirectory' => 'resources/dist',
    ];

    public function bootAddon()
    {
        //
    }
}
