import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  private readonly userIdx = 'lint_user_idx';
  constructor(private readonly esService: ElasticsearchService) {}

  /**
   * Call the search method of the ElasticsearchService to search for documents in the specified index.
   * @param params search parameters: include index and elasticsearch body
   * @returns Array of search results
   */
  async search(params: { index: string; body: any }) {
    return this.esService.search(params);
  }

  /**
   * Call the search method of the ElasticsearchService to get suggetions for user names in the user index.
   * @param query search query
   * @param size number of results to return
   * @param from starting index
   * @returns Array of search results
   */
  async usernameAutocomplete({
    query,
    size,
  }: {
    query: string;
    size?: number;
  }) {
    const result = await this.search({
      index: this.userIdx,
      body: {
        suggest: {
          suggestion: {
            prefix: query,
            completion: {
              field: 'profile.name.completion',
              fuzzy: {
                fuzziness: 'auto',
              },
            },
          },
        },
      },
    });
    return result.suggest?.suggestion[0]?.options;
  }

  /**
   * Call the search method of the ElasticsearchService to search for users in the user index.
   * @param query search query
   * @param size number of results to return
   * @param from starting index
   * @returns Array of search results
   */
  async searchUsers({
    query,
    from,
    size,
  }: {
    query: string;
    from?: number;
    size?: number;
  }) {
    const result = await this.search({
      index: this.userIdx,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['profile.name', 'profile.alias'],
            fuzziness: 'auto',
          },
        },
        from,
        size,
      },
    });
    return result.hits.hits;
  }
}
