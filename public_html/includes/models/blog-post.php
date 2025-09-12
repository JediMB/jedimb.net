<?php

class BlogPost {
    public int $id;
    public string $permalink;
    public string $title;
    public string $content;
    public string|null $mastolink;
    public DateTime $createdOn;
    public DateTime|null $modifiedOn;
    public bool $isPublished;
    public bool $isVisible;
    public bool $isPinned;

    public function __construct(array $dbRow)
    {
        try {
            $this->id = $dbRow['id'];
            $this->permalink = $dbRow['permalink'];
            $this->title = $dbRow['title'];
            $this->content = $dbRow['content'];
            $this->mastolink = $dbRow['mastolink'];
            $this->createdOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['created_on']);
            $this->modifiedOn = DateTime::createFromFormat('Y-m-d H:i:se', $dbRow['modified_on']) ?: null;
            $this->isPublished = $dbRow['is_published'];
            $this->isVisible = $dbRow['is_visible'];
            $this->isPinned = $dbRow['is_pinned'];
        }
        catch (Exception $e) {
            echo 'Error converting database row to BlogPost object: ' . $e->getMessage();
        }
    }
}

?>