import Resizer from "react-image-file-resizer";

const resizeFile = async (file: File, quality: number) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      2000,
      2000,
      "JPEG",
      quality,
      0,
      (file) => {
        resolve(file);
      },
      "file",
    );
  });

export const constraintImage = async (
  file: File,
  quality = 90,
  drop = 10,
): Promise<File> => {
  const done = (await resizeFile(file, quality)) as File;

  if (done.size > 200000 && quality - drop > 10) {
    return constraintImage(file, quality - drop);
  }
  return done;
};
