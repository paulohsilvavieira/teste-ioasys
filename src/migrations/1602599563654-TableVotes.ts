import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableVotes1602599563654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'moviesId',
            type: 'int',
          },
          {
            name: 'value',
            type: 'double',
          },
          {
            name: 'usersId',
            type: 'int',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes');
  }
}
