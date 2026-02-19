import { PrismaClient } from "@@/prisma/generated/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    omit: {
      painting: { imageFilename: true, imageWidth: true, imageHeight: true },
      drawing: { imageFilename: true, imageWidth: true, imageHeight: true },
      categoryContent: {
        imageFilename: true,
        imageWidth: true,
        imageHeight: true,
      },
      user: {
        password: true,
      },
    },
  }).$extends({
    result: {
      painting: {
        images: {
          needs: {
            imageFilename: true,
            imageWidth: true,
            imageHeight: true,
          },
          compute(painting) {
            return [
              {
                filename: painting.imageFilename,
                width: painting.imageWidth,
                height: painting.imageHeight,
                isMain: true,
              },
            ];
          },
        },
        length: {
          compute() {
            return 0;
          },
        },
      },
      drawing: {
        images: {
          needs: {
            imageFilename: true,
            imageWidth: true,
            imageHeight: true,
          },
          compute(drawing) {
            return [
              {
                filename: drawing.imageFilename,
                width: drawing.imageWidth,
                height: drawing.imageHeight,
                isMain: true,
              },
            ];
          },
        },
        length: {
          compute() {
            return 0;
          },
        },
      },
      categoryContent: {
        image: {
          needs: {
            imageFilename: true,
            imageWidth: true,
            imageHeight: true,
          },
          compute(categoryContent) {
            return {
              id: 0,
              filename: categoryContent.imageFilename,
              width: categoryContent.imageWidth,
              height: categoryContent.imageHeight,
              isMain: true,
            };
          },
        },
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
