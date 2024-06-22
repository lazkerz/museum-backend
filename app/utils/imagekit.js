import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const imageUploader = {
    uploadImagekit(file) {
        return new Promise((resolve, reject) => {
            imagekit.upload({
                file: file.buffer,
                fileName: file.originalname,
                extensions: [
                    {
                        name: "google-auto-tagging",
                        maxTags: 5,
                        minConfidence: 95
                    }
                ],
                responseFields: ["url"]
            }, function (err, result){
                if(err) {
                    reject(err); // Handle error by rejecting the Promise
                } else if (result) { // Check if result is not null
                    resolve(result.url); // Resolve the Promise with the URL
                } else {
                    reject(new Error("Image upload failed")); // Reject if result is null
                }
            });
        });
    }
};

export { imageUploader };
