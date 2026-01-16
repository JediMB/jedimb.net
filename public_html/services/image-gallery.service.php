<?php declare(strict_types=1);

namespace Services;

require_once 'models/db/gallery-image.db.model.php';
require_once 'models/dto/gallery-images.dto.model.php';
require_once 'models/dto/gallery.dto.model.php';
require_once 'models/dto/image.dto.model.php';
require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/gallery-image.db.service.php';
require_once 'services/db/gallery.db.service.php';
require_once 'services/db/image.db.service.php';

use Exception;
use Models\DB\Gallery;
use Models\DB\GalleryImage;
use Models\DB\Image;
use Models\DTO\Gallery as GalleryDTO;
use Models\DTO\GalleryImages;
use Models\DTO\Image as ImageDTO;
use Services\TableModifiedService;
use Services\Base\Singleton;
use Services\DB\GalleryImageDBService;
use Services\DB\GalleryDBService;
use Services\DB\ImageDBService;

class ImageGalleryService extends Singleton {
    private GalleryImageDBService $galleryImageDbService;
    private GalleryDBService $galleryDbService;
    private ImageDBService $imageDbService;
    private TableModifiedService $tableModifiedService;

    protected function __construct() {
        $this->galleryImageDbService = GalleryImageDBService::getInstance();
        $this->galleryDbService = GalleryDBService::getInstance();
        $this->imageDbService = ImageDBService::getInstance();
        $this->tableModifiedService = TableModifiedService::getInstance();
    }

    /** @return array{'gallery': \Models\DB\Gallery, 'modifiedOn': \DateTime} */
    public function createGallery(GalleryDTO $galleryDTO) : array {
        return [
            'gallery' => $this->galleryDbService->createGallery($galleryDTO),
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery')
        ];
    }

    /** @return array{'image': \Models\DB\Image, 'modifiedOn': \DateTime} */
    public function createImage(ImageDTO $imageDTO) : array {
        return [
            'image' => $this->imageDbService->createImage($imageDTO),
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('image')
        ];
    }

    /** @return array{'id': int, 'modifiedOn': \DateTime} */
    public function deleteGallery(int $id) : array|false {
        $deletedGallery = $this->galleryDbService->deleteGallery($id);

        if (!$deletedGallery)
            return false;

        return [
            'id' => $deletedGallery->id,
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery')
        ];
    }

    /** @return array{'id': int, 'modifiedOn': \DateTime} */
    public function deleteImage(int $id) : array|false {
        $deletedImage = $this->imageDbService->deleteImage($id);

        if (!$deletedImage)
            return false;

        if ( ($realpath = realpath(PATH_IMAGE_GALLERY . "/$deletedImage->filename")) )
            unlink($realpath);

        return [
            'id' => $deletedImage->id,
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('image')
        ];
    }

    /** @return Gallery[] */
    public function getGalleries() : array {
        return $this->galleryDbService->getGalleries();
    }

    public function getGallery(int $id) : Gallery {
        return $this->galleryDbService->getGallery($id);
    }

    public function getImage(int $id) : Image {
        return $this->imageDbService->getImage($id);
    }

    public function getImages() : array {
        /*
            TODO:
            Use $this->galleryImageDbService->getGalleryImages();
            and merge that data into  the Image objects here instead of
            in ImageDBService

            Then remove the view that is used now.
        */
        return $this->imageDbService->getImages();
    }

    /** @return array{'gallery': \Models\DB\Gallery, 'modifiedOn': \DateTime} */
    public function updateGallery(GalleryDTO $galleryDTO) : array {
        $gallery = $this->galleryDbService->getGallery($galleryDTO->id);
        GalleryDTO::update($gallery, $galleryDTO);

        $updatedGallery = $this->galleryDbService->updateGallery($gallery);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery');

        return [
            'gallery' => $updatedGallery,
            'modifiedOn' => $modifiedOn
        ];
    }

    /** @return string[]|true */
    public function updateGalleryImages(GalleryImages $galleryImagesDTO) : array|true {
        if ( ( $galleryId = $galleryImagesDTO->galleryId ) < 1 )
            throw new Exception('A gallery id cannot be less than 1.');

        $imageIds = [];
        foreach ($galleryImagesDTO->imageIds as $imageId) {
            if (isset($imageIds[$imageId]))
                throw new Exception("Duplicate image ids ($imageId) found when updating image list for gallery ($galleryId).");

            $imageIds[$imageId] = true;
        }

        $dbGalleryImages = $this->galleryImageDbService->getGalleryImages($galleryId);

        $addedImageIds = array_filter($galleryImagesDTO->imageIds, fn($imageId) =>
            !array_any($dbGalleryImages, fn($row) => $row->imageId === $imageId)
        );
        $addedGalleryImages = array_map(
            fn($imageId, $order) => GalleryImage::create($galleryId, $imageId, $order),
            $addedImageIds, array_keys(($addedImageIds))
        );
        
        $updatedGalleryImages = array_filter($dbGalleryImages, function($row) use ($galleryImagesDTO) {
            $orderKey = array_find_key($galleryImagesDTO->imageIds, fn($imageId) =>  $imageId === $row->imageId);

            if ($orderKey && $orderKey !== $row->order) {
                $row->order = $orderKey;
                return true;
            }
            return false;
        });

        $removedGalleryImages = array_filter($dbGalleryImages, fn($row) =>
            !array_any($galleryImagesDTO->imageIds, fn($imageId) => $imageId === $row->imageId)
        );

        $errors = [];

        $createErrors = [];
        foreach ($addedGalleryImages as $addedGalleryImage) {
            $result = $this->galleryImageDbService->createGalleryImage($addedGalleryImage);

            if (!$result->match($addedGalleryImage))
                $createErrors[] = $result->id;
                //throw new Exception('Created GalleryImage did not match source data');
        }
        if ($createErrors)
            $errors[] = "Created GalleryImages did not match source data for rows " . implode(', ', $createErrors);

        $updateErrors = [];
        foreach ($updatedGalleryImages as $updatedGalleryImage) {
            $result = $this->galleryImageDbService->updateGalleryImage($updatedGalleryImage);

            if (!$result->match($addedGalleryImage, true))
                $updateErrors[] = $result->id;
                
        }
        if ($updateErrors)
            $errors[] = "Updated GalleryImages did not match source data for rows " . implode(', ', $updateErrors);

        $deleteMissing = [];
        $deleteErrors = [];
        foreach ($removedGalleryImages as $removedGalleryImage) {
            $result = $this->galleryImageDbService->deleteGalleryImage($removedGalleryImage->id);

            if (!$result)
                $deleteMissing[] = true;
            else if ($result->id !== $removedGalleryImage->id)
                $deleteErrors[] = $result->id;
        }
        if ($deleteMissing)
            $errors[] = "Attempted to delete nonexistent GalleryImages on rows " . implode(', ', $deleteMissing);
        if ($deleteErrors)
            $errors[] = "Incorrectly deleted GalleryImages on rows " . implode(', ', $deleteErrors);

        if ($errors)
            return $errors;

        return true;
    }

    /** @return array{'image': \Models\DB\Image, 'modifiedOn': \DateTime} */
    public function updateImage(ImageDTO $imageDTO) : array {
        $image = $this->imageDbService->getImage($imageDTO->id);
        ImageDTO::update($image, $imageDTO);

        $updatedImage = $this->imageDbService->updateImage($image);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('image');

        return [
            'image' => $updatedImage,
            'modifiedOn' => $modifiedOn
        ];
    }
}

?>