import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async search(index: string, query: any) {
    const result = await this.esService.search({
      index,
      body: {
        query,
      },
    });
    return result.hits.hits;
  }
}
