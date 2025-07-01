import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  // data property should be defined and decorated in extending classes
  // Example: @ApiProperty({ type: [SpecificType] }) data: SpecificType[];
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty({
    description: 'Next page number if there are more pages, null if this is the last page',
    example: 2,
    nullable: true,
  })
  nextPage: number | null;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}
