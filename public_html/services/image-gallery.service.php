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

use Error;
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

    /** @return (array{'gallery': Gallery, 'modifiedOn': \DateTime}) */
    public function createGallery(GalleryDTO $galleryDTO) : array {
        return [
            'gallery' => $this->galleryDbService->createGallery($galleryDTO),
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery')
        ];
    }

    /** @return (array{'image': Image, 'modifiedOn': \DateTime}|array{'badrequest': true, 'message': string}) */
    public function createImage(ImageDTO $imageDTO, string $fileData) : array {
        try {
            $basename = date('Ymd_His_') . str_pad(dechex(rand(0x0000, 0xFFFF)), 4, '0', STR_PAD_LEFT);
            $filepath = PATH_TEMP_DIR . '/' . $basename;

            if (!realpath(PATH_TEMP_DIR))
                mkdir(PATH_TEMP_DIR, 0777, true);

            if ( !($file = fopen($filepath, 'wb')) )
                throw new Error(TEXT_IMAGE_COULD_NOT_BE_CREATED);

            stream_filter_append($file, 'convert.base64-decode');
            fwrite($file, $fileData);
            fclose($file);

            $mime = mime_content_type($filepath);

            if (empty(UPLOAD_IMAGE_MIME_TYPES[$mime])) {
                unlink($filepath);
                return [
                    'badrequest' => true,
                    'message' => TEXT_IMAGE_DISALLOWED_TYPE . $mime
                ];
            }

            $finalName = "$basename." . UPLOAD_IMAGE_MIME_TYPES[$mime];
            $imageDTO->filename = $finalName;

            $createdImage = $this->imageDbService->createImage($imageDTO);
            $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('image');

            if (!realpath(PATH_IMAGE_GALLERY))
                mkdir(PATH_IMAGE_GALLERY, 0777, true);

            rename($filepath, PATH_IMAGE_GALLERY . "/$finalName");
        
            return [
                'image' => $createdImage,
                'modifiedOn' => $modifiedOn
            ];
        }
        catch (Exception $e) {
            if ( isset($filepath) && ($realpath = realpath($filepath)) )
                unlink($realpath);

            throw $e;
        }
    }

    /** @return (array{'id': int, 'modifiedOn': \DateTime}) */
    public function deleteGallery(int $id) : array|false {
        $deletedGallery = $this->galleryDbService->deleteGallery($id);

        if (!$deletedGallery)
            return false;

        return [
            'id' => $deletedGallery->id,
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery')
        ];
    }

    /** @return (array{'id': int, 'modifiedOn': \DateTime}) */
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
        $galleries = $this->galleryDbService->getGalleries();
        $mappedGalleries = array_combine(array_map(fn($gallery) => $gallery->id, $galleries), $galleries); /** @var Gallery[] $mappedGalleries */

        $galleryImages = $this->galleryImageDbService->getGalleryImages();
        foreach ($galleryImages as $galleryImage)
            $mappedGalleries[$galleryImage->galleryId]->imageIds[] = $galleryImage->imageId;

        return $mappedGalleries;
    }

    public function getGallery(int $id) : Gallery {
        $gallery = $this->galleryDbService->getGallery($id);
        $galleryImages = $this->galleryImageDbService->getGalleryImages($gallery->id);

        $gallery->imageIds = array_map(fn($galleryImage) => $galleryImage->imageId, $galleryImages);

        return $gallery;
    }

    public function getImage(int $id) : Image {
        $image = $this->imageDbService->getImage($id);
        $galleryImages = $this->galleryImageDbService->getGalleryImages($id, true);

        $image->galleryIds = array_map(fn($galleryImage) => $galleryImage->galleryId, $galleryImages);

        return $image;
    }

    /** @return Image[] */
    public function getImages() : array {
        $images = $this->imageDbService->getImages();
        $mappedImages = array_combine(array_map(fn($image) => $image->id, $images), $images); /** @var Image[] $mappedImages */

        $galleryImages = $this->galleryImageDbService->getGalleryImages();
        foreach ($galleryImages as $galleryImage)
            $mappedImages[$galleryImage->imageId]->galleryIds[] = $galleryImage->galleryId;

        return $mappedImages;
    }

    /** @return (array{'gallery': Gallery, 'modifiedOn': \DateTime}) */
    public function updateGallery(GalleryDTO $galleryDTO) : array {
        $gallery = $this->galleryDbService->getGallery($galleryDTO->id);
        GalleryDTO::update($gallery, $galleryDTO);

        $updatedGallery = $this->galleryDbService->updateGallery($gallery);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery');

        $galleryImages = $this->galleryImageDbService->getGalleryImages($updatedGallery->id);
        $updatedGallery->imageIds = array_map(fn($galleryImage) => $galleryImage->imageId, $galleryImages);

        return [
            'gallery' => $updatedGallery,
            'modifiedOn' => $modifiedOn
        ];
    }

    /** @return (array{'gallery': Gallery, 'removed': GalleryImages, 'modifiedOn': \DateTime}|array{'errors': true, 'messages': string[]}) */
    public function updateGalleryImages(GalleryImages $galleryImagesDTO) : array {
        if ( ( $galleryId = $galleryImagesDTO->galleryId ) < 1 )
            throw new Exception('A gallery id cannot be less than 1.');

        $imageOrder = [];
        foreach ($galleryImagesDTO->imageIds as $order => $imageId) {
            if (isset($imageOrder[$imageId]))
                throw new Exception("Duplicate image ids ($imageId) found when updating image list for gallery ($galleryId).");

            $imageOrder[$imageId] = (int) $order + 1; // No 0 for ordered images
        }

        $dbGalleryImages = $this->galleryImageDbService->getGalleryImages($galleryId);

        $addedGalleryImages = array_map(fn($imageId) => GalleryImage::create($galleryId, $imageId, $imageOrder[$imageId]),
            array_diff($galleryImagesDTO->imageIds, array_map(fn($gi) => $gi->imageId, $dbGalleryImages))
        );
        
        $updatedGalleryImages = array_filter($dbGalleryImages, function($row) use ($imageOrder) {
            if (!isset($imageOrder[$row->imageId]))
                return false;

            $order = $imageOrder[$row->imageId];
            if ($row->order === $order)
                return false;

            $row->order = $order;
            return true;
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
        }
        if ($createErrors)
            $errors[] = "Created GalleryImages did not match source data for rows " . implode(', ', $createErrors);

        $updateErrors = [];
        foreach ($updatedGalleryImages as $updatedGalleryImage) {
            $result = $this->galleryImageDbService->updateGalleryImage($updatedGalleryImage);

            if (!$result->match($updatedGalleryImage, true))
                $updateErrors[] = $result->id;
                
        }
        if ($updateErrors)
            $errors[] = "Updated GalleryImages did not match source data for rows " . implode(', ', $updateErrors);

        $deletedGalleryImageRows = new GalleryImages(['galleryId' => $galleryId, 'imageIds' => []]);
        $deleteMissing = [];
        $deleteErrors = [];
        foreach ($removedGalleryImages as $removedGalleryImage) {
            $result = $this->galleryImageDbService->deleteGalleryImage($removedGalleryImage->id);

            if (!$result) {
                $deleteMissing[] = true;
                continue;
            }
            
            if ($result->id !== $removedGalleryImage->id) {
                $deleteErrors[] = $result->id;
                continue;
            }

            $deletedGalleryImageRows->imageIds[] = $result->imageId;
        }
        if ($deleteMissing)
            $errors[] = "Attempted to delete nonexistent GalleryImages on rows " . implode(', ', $deleteMissing);
        if ($deleteErrors)
            $errors[] = "Incorrectly deleted GalleryImages on rows " . implode(', ', $deleteErrors);

        if ($errors)
            return [
                'errors' => true,
                'messages' => $errors
            ];

        return [
            'gallery' => $this->getGallery($galleryId),
            'removed' => $deletedGalleryImageRows,
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('gallery_image')
        ];
    }

    /** @return (array{'image': Image, 'modifiedOn': \DateTime}) */
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