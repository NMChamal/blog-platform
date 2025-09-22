import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { AppError } from '../middleware/errorHandler';
import path from 'path';
import util from 'util';

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw new AppError('No files uploaded', 400);
    }

    const files = req.files as Express.Multer.File[];
    const urls: string[] = [];

    for (const file of files) {
      const filename = `image-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpeg`;
      const filepath = path.resolve(`public/uploads/${filename}`);
      console.log('Saving image to:', filepath);

      await sharp(file.buffer)
        .resize(800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(filepath);

      urls.push(`/uploads/${filename}`);
    }

    res.status(201).json({ success: true, data: { urls } });

  } catch (error) {
    console.error(util.inspect(error, { showHidden: false, depth: null, colors: true }));
    next(error);
  }
};