import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Url } from './entities/url.entity';
import { encodeToBase62 } from '../utils';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
  ) {}

  private async fetchTitle(url: string): Promise<string | null> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const title = $('title').text();

      return title || 'No title available';
    } catch (error) {
      console.error(`Error fetching title for URL: ${url}`, error);
      return null;
    }
  }

  async shortenUrl(originalUrl: string): Promise<string> {
    // Check if the URL is already shortened
    let existingUrl = await this.urlRepository.findOne({
      where: { originalUrl },
    });
    if (existingUrl) {
      return existingUrl.shortUrl;
    }

    const newUrl = this.urlRepository.create({ originalUrl });
    const savedUrl = await this.urlRepository.save(newUrl);

    // Convert the auto-incrementing ID to Base62
    const shortUrl = encodeToBase62(savedUrl.id);

    savedUrl.shortUrl = shortUrl;

    // Fetch the title asynchronously
    const title = await this.fetchTitle(originalUrl);
    savedUrl.title = title;

    await this.urlRepository.save(savedUrl);

    return shortUrl;
  }

  async findOriginalUrl(shortUrl: string): Promise<string | null> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });

    if (url) {
      // Increment access count each time the short URL is accessed
      url.accessCount += 1;
      await this.urlRepository.save(url);
      return url.originalUrl;
    }

    return null;
  }

  async getTopUrls(limit: number = 100): Promise<Url[]> {
    return await this.urlRepository.find({
      order: {
        accessCount: 'DESC', // Order by accessCount in descending order
      },
      take: limit, // Limit to top 100
    });
  }
}
