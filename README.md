# image-dater

> Not ready for general use!

Renames image files to include exif date/time.

    node index.js <image files>

Renames each image file to start with the EXIF creation date. For example, `img1.jpg` -> `2016-02-25_09:00:00_img1.jpg`.

I wrote this script to rename one directory of images one time. It worked just fine, but there is no error handling and no tests so use with caution.
