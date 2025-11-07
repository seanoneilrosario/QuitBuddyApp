import { Image } from "react-native";

export const prefetchImages = (urls: string[]) => {
    urls.forEach((url) => {
        if (url) Image.prefetch(url);
    });
};
