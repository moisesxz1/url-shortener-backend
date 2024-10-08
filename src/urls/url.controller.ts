import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body('originalUrl') originalUrl: string) {
    const shortUrl = await this.urlService.shortenUrl(originalUrl);
    return { shortUrl: shortUrl }; // You can replace with your domain
  }

  @Get('top')
  async getTopUrls() {
    const topUrls = await this.urlService.getTopUrls(100); // Get the top 100 URLs
    return topUrls;
  }

  @Get(':shortUrl')
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.urlService.findOriginalUrl(shortUrl);
    if (originalUrl) {
      return res.redirect(originalUrl);
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'URL not found' });
    }
  }
}
