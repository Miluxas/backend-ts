import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Imgproxy from 'imgproxy';

@Injectable()
export class ImageProxyService {
  constructor(protected readonly configService: ConfigService) {
    this.imageProxy = new Imgproxy({
      baseUrl: configService.get('IMGPROXY_URL'),
      key: configService.get('IMGPROXY_KEY'),
      salt: configService.get('IMGPROXY_SALT'),
      encode: true,
    });
  }
  private imageProxy: Imgproxy;

  public getLinks(
    url: string,
    sizes: string[],
  ): { width: number; webp: boolean; dp: number; url: string }[] {
    if (!this.imageProxy || !sizes) return [];
    return sizes
      .map((size) =>
        [false, true].map((webp) => this.generate(url, size, webp)),
      )
      .flat();
  }

  private parseString(str: string): [number, number] {
    const pattern = /^(\d*)?@(\d*)/;
    const match = str.match(pattern);
    if (match) {
      const [_, width = '0', dp = '1'] = match;
      return [parseInt(width), parseInt(dp)];
    } else {
      return [0, 1];
    }
  }

  private generate(
    url: string,
    size: string,
    webp = false,
  ): { width: number; webp: boolean; dp: number; url: string } {
    console.log('url', url);
    let builder = this.imageProxy.builder();
    const [width, dp] = this.parseString(size);
    if (width) builder = builder.resize('fill', width);
    if (dp) builder = builder.dpr(dp);
    if (webp) builder = builder.format('webp');
    return {
      width: width ? width : null,
      webp,
      dp,
      url: builder.generateUrl(url),
    };
  }
}
