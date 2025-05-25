import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileInterceptor as NestFileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FileInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

      if (AWS_S3_BUCKET) {
        // TODO: apply the S3 file upload logic here
        this.logger.log(
          'AWS S3 bucket detected. Start uploading the file to the S3 bucket.',
        );
      } else {
        const localFileInterceptor = new (NestFileInterceptor('image', {
          storage: diskStorage({
            destination: './upload',
            filename: (req, file, callback) => {
              const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);

              const ext = extname(file.originalname);
              callback(
                null,
                `${file.originalname.split('.')[0]}-${uniqueSuffix}${ext}`,
              );
            },
          }),
        }) as any)();

        return localFileInterceptor.intercept(context, next);
      }
    } catch (error) {
      this.logger.error('Error in FileInterceptor', error.stack);
      throw error;
    }

    return next.handle();
  }
}
