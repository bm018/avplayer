(function(ns, document)
{
    var KEY_ORDER = ["xs", "s", "m", "l", "xl"];

    var ResponsiveImage = function(imageMap, imageDomObject, targetRepresentation, errorCallback)
    {
        this.imageMap       = imageMap;
        this.imageDomObject = imageDomObject;
        this.errorCallback  = errorCallback;
        this.targetMap      = {};

        if(targetRepresentation)
            this.switchRepresentation(targetRepresentation);
    };

    ResponsiveImage.prototype =
    {
        imageMap:undefined,
        targetMap:undefined,
        imageDomObject:undefined,
        currentRepresentation:undefined,
        targetRepresentation:undefined,
        errorCallback:undefined,




        switchRepresentation:function(representation)
        {
            if(representation === null && this.errorCallback)                                   // tried everything but can't find an image, so this is definitely an error
                this.errorCallback();

            if(this.currentRepresentation == representation)                                    // already done
                return;

            this.targetRepresentation = representation;                                         // set expected new representation

            if(this.hasImage(representation))                                                   // if image requested or loaded and has no error
            {
                if(this.getImage(representation))                                               // if expected representation exists and is loaded without errors
                    this.showImage(representation);                                             // show it -> otherwise do nothing and wait for preloading to complete
            }
            else
            {
                var existingBiggerRepresentation = this.getExistingBigger(representation);

                if(existingBiggerRepresentation)                                                // if there is a bigger image loaded
                    this.switchRepresentation(existingBiggerRepresentation);                    // use that ("no senseless traffic" rule)

                else if(this.errorOrNotExisting(representation))                                // if the image has an error or does not exit
                    this.switchRepresentation(this.getNearest(representation));                 // show the nearest existing image with no error

                else
                    this.preloadImage(representation);                                          // otherwise try loading it
            }
        },




        hasImage:function(representation)
        {
            var target = this.targetMap[representation];
            return target && !target.error;
        },




        getImage:function(representation)
        {
            var target = this.targetMap[representation];
            if(target && target.loaded && !target.error)
                return target.image;

            return null;
        },




        getExistingBigger:function(representation)
        {
            var index = this.getKeyIndex(representation);
            if(index == -1)
                throw new Error("Unknown image size: " + representation);

            var key, target;
            while(index < KEY_ORDER.length)
            {
                key    = KEY_ORDER[++index];
                target = this.targetMap[key];
                if(target && !target.error)                                                    // representation exists and has no error (maybe currently loading)
                    return key;
            }
            return null;
        },




        errorOrNotExisting:function(representation)
        {
            var target = this.targetMap[representation];
            if(target && target.error)                                                          // return true, if there was one while loading this image
                return true;

            if(!this.imageMap[representation])                                                  // return true, if the representation wasn't defined
                return true;

            return false;                                                                       // no error and representation was defined
        },




        getNearest:function(representation)
        {
            var index = this.getKeyIndex(representation);
            if(index == -1)
                throw new Error("Unknown image size: " + representation);

            var key, target, i = index;
            while(i >= 0)                                                                       // search for a smaller represenation
            {
                key    = KEY_ORDER[--i];
                target = this.imageMap[key];                                                    // which is defined
                if(target)
                {
                    target = this.targetMap[key];
                    if(!target || target.error === false)                                       // and which isn't requested, or has no error
                        return key;
                }
            }

            i = index;
            while(i < KEY_ORDER.length)                                                         // search for bigger represenations
            {
                key    = KEY_ORDER[++i];
                target = this.imageMap[key];                                                    // which is defined
                if(target)
                {
                    target = this.targetMap[key];
                    if(!target || target.error === false)                                       // and which isn't requested, or has no error
                        return key;
                }
            }

            return null;
        },




        preloadImage:function(representation)
        {
            var that   = this;
            var image  = document.createElement("img");                                         // create a new image
            var target = this.targetMap[representation] =                                       // cache the image for later use
            {
                image:image,
                loaded:false,                                                                   // track the loading state for later use
                error:false                                                                     // track an possible error
            };

            image.onload = function()
            {
                image.onload  = null;                                                           // clear callbacks
                image.onerror = null;
                target.loaded = true;                                                           // flag as loaded
                that.showImage(representation);                                                 // show the preloaded image
            };

            image.onerror = function()
            {
                image.onload  = null;                                                           // clear callbacks
                image.onerror = null;
                target.error  = true;                                                           // set error flag
                if(that.targetRepresentation == representation)
                    that.switchRepresentation(that.getNearest(representation));
            };

            image.src = this.imageMap[representation];                                          // finally, start loading
        },




        showImage:function(representation)
        {
            if(this.targetRepresentation != representation)                                     // do nothing, if representation to show isn't the expected one
                return;

            if(this.currentRepresentation == representation)                                    // do nothing, if representation to show is the current one
                return;

            var image = this.getImage(representation);                                          // get the preloaded image

            this.imageDomObject.src = image.src;                                                // copy src to dom image
            this.currentRepresentation = representation;                                        // finaly change the current representation
        },




        getKeyIndex:function(key)
        {
            var i, l = KEY_ORDER.length;
            for(i = 0; i < l; ++i)
            {
                if(KEY_ORDER[i] == key)
                    return i;
            }
            return -1;
        },




        dispose:function()
        {
            var key;
            for(key in this.targetMap)
            {
                this.targetMap[key].onload  = null;
                this.targetMap[key].onerror = null;
                delete this.targetMap[key];
            }
        }
    };

    ns.ResponsiveImage = ResponsiveImage;

})(ardplayer, document);
